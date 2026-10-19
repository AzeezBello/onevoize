'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Images,
  Film,
  Image as ImageIcon,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Upload,
  Link as LinkIcon,
  Search,
  AlertCircle,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import type { GalleryItemRecord } from '@/lib/gallery-server';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { tapScale, springConfig } from '@/lib/motion';

interface Props {
  initialItems: GalleryItemRecord[];
}

type FilterMode = 'all' | 'image' | 'video' | 'hidden';
type SourceMode = 'upload' | 'url';

export function GalleryManagerClient({ initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItemRecord[]>(initialItems);
  const [filter, setFilter] = useState<FilterMode>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Native <dialog> ref & state for Add / Edit modal
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItemRecord | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [sourceMode, setSourceMode] = useState<SourceMode>('upload');
  const [srcInput, setSrcInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState('club');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [isPublished, setIsPublished] = useState(true);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Mandatory fallback for browsers without native <dialog closedby="any"> support
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const handleBackdropClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (isDialogContent) return;
        dialog.close();
      };
      dialog.addEventListener('click', handleBackdropClick);
      return () => dialog.removeEventListener('click', handleBackdropClick);
    }
  }, []);

  // Revoke object URL when preview changes
  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    };
  }, [filePreviewUrl]);

  function openCreateModal(defaultType: 'image' | 'video' = 'image') {
    setEditingItem(null);
    setMediaType(defaultType);
    setSourceMode('upload');
    setSrcInput('');
    setSelectedFile(null);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(null);
    setTitle('');
    setCaption('');
    setAltText('');
    setCategory(defaultType === 'video' ? 'events' : 'club');
    const maxOrder = items.reduce((max, i) => Math.max(max, i.display_order || 0), 0);
    setDisplayOrder(String(maxOrder + 1));
    setIsPublished(true);
    setFormError('');
    dialogRef.current?.showModal();
  }

  function openEditModal(item: GalleryItemRecord) {
    setEditingItem(item);
    setMediaType(item.media_type);
    setSourceMode('url');
    setSrcInput(item.src);
    setSelectedFile(null);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(null);
    setTitle(item.title);
    setCaption(item.caption || '');
    setAltText(item.alt_text || item.caption || item.title);
    setCategory(item.category || 'club');
    setDisplayOrder(String(item.display_order ?? 1));
    setIsPublished(item.is_published);
    setFormError('');
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    if (file) {
      setFilePreviewUrl(URL.createObjectURL(file));
      if (file.type.startsWith('video/')) {
        setMediaType('video');
      } else if (file.type.startsWith('image/')) {
        setMediaType('image');
      }
      if (!title) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        setTitle(cleanName);
      }
    } else {
      setFilePreviewUrl(null);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please provide a title for this media item.');
      return;
    }

    if (sourceMode === 'upload' && !selectedFile && !editingItem) {
      setFormError('Please choose an image or video file to upload, or switch to Media Path / URL.');
      return;
    }

    if (sourceMode === 'url' && !srcInput.trim()) {
      setFormError('Please provide a valid media path or URL.');
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = editingItem ? `/api/admin/gallery/${editingItem.id}` : '/api/admin/gallery';
      const method = editingItem ? 'PATCH' : 'POST';

      let res: Response;
      if (selectedFile) {
        const fd = new FormData();
        fd.append('file', selectedFile);
        fd.append('media_type', mediaType);
        fd.append('title', title.trim());
        fd.append('caption', caption.trim());
        fd.append('alt_text', (altText || caption || title).trim());
        fd.append('category', category.trim() || 'club');
        fd.append('display_order', displayOrder);
        fd.append('is_published', String(isPublished));
        if (srcInput.trim()) fd.append('src', srcInput.trim());

        res = await fetch(endpoint, { method, body: fd });
      } else {
        res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            media_type: mediaType,
            src: srcInput.trim(),
            title: title.trim(),
            caption: caption.trim(),
            alt_text: (altText || caption || title).trim(),
            category: category.trim() || 'club',
            display_order: Number(displayOrder) || 1,
            is_published: isPublished,
          }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save gallery item');
      }

      if (editingItem) {
        setItems(prev => prev.map(it => (it.id === editingItem.id ? data.item : it)));
        setBanner({ type: 'success', text: `Updated "${data.item.title}" in the gallery.` });
      } else {
        setItems(prev => [...prev, data.item].sort((a, b) => a.display_order - b.display_order));
        setBanner({ type: 'success', text: `Added "${data.item.title}" to the gallery.` });
      }

      closeModal();
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save gallery item');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTogglePublish(item: GalleryItemRecord) {
    setBusyId(item.id);
    setBanner(null);
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !item.is_published }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update visibility');
      setItems(prev => prev.map(it => (it.id === item.id ? data.item : it)));
      setBanner({
        type: 'success',
        text: `"${item.title}" is now ${data.item.is_published ? 'published on the live gallery' : 'hidden from the public gallery'}.`,
      });
      router.refresh();
    } catch (err) {
      setBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Could not update item visibility',
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleMoveOrder(item: GalleryItemRecord, direction: 'up' | 'down') {
    const sameType = [...items].sort((a, b) => a.display_order - b.display_order || a.id - b.id);
    const idx = sameType.findIndex(i => i.id === item.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sameType.length) return;

    const neighbor = sameType[swapIdx];
    const newOrderForItem = neighbor.display_order;
    const newOrderForNeighbor =
      item.display_order === neighbor.display_order
        ? direction === 'up'
          ? item.display_order + 1
          : Math.max(1, item.display_order - 1)
        : item.display_order;

    setBusyId(item.id);
    try {
      await Promise.all([
        fetch(`/api/admin/gallery/${item.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: newOrderForItem }),
        }),
        fetch(`/api/admin/gallery/${neighbor.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: newOrderForNeighbor }),
        }),
      ]);

      setItems(prev =>
        prev
          .map(it => {
            if (it.id === item.id) return { ...it, display_order: newOrderForItem };
            if (it.id === neighbor.id) return { ...it, display_order: newOrderForNeighbor };
            return it;
          })
          .sort((a, b) => a.display_order - b.display_order || a.id - b.id),
      );
      router.refresh();
    } catch {
      setBanner({ type: 'error', text: 'Failed to reorder gallery items.' });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(item: GalleryItemRecord) {
    if (!window.confirm(`Delete "${item.title}" from the gallery? This cannot be undone.`)) {
      return;
    }
    setBusyId(item.id);
    setBanner(null);
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete item');
      setItems(prev => prev.filter(it => it.id !== item.id));
      setBanner({ type: 'success', text: `Deleted "${item.title}" from the gallery.` });
      router.refresh();
    } catch (err) {
      setBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to delete item',
      });
    } finally {
      setBusyId(null);
    }
  }

  const totalPhotos = items.filter(i => i.media_type === 'image').length;
  const totalVideos = items.filter(i => i.media_type === 'video').length;
  const publishedCount = items.filter(i => i.is_published).length;
  const hiddenCount = items.length - publishedCount;

  const filteredItems = items.filter(item => {
    if (filter === 'image' && item.media_type !== 'image') return false;
    if (filter === 'video' && item.media_type !== 'video') return false;
    if (filter === 'hidden' && item.is_published) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCaption = (item.caption || '').toLowerCase().includes(q);
      const matchAlt = (item.alt_text || '').toLowerCase().includes(q);
      const matchSrc = item.src.toLowerCase().includes(q);
      return matchTitle || matchCaption || matchAlt || matchSrc;
    }
    return true;
  });

  const activePreviewSrc = filePreviewUrl || srcInput.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Images size={20} className="text-primary" aria-hidden="true" />
            Gallery Media Manager
          </h2>
          <p className="text-sm text-muted-foreground">
            Upload, edit, reorder, and publish club photos and videos displayed on the website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
            <a href="/gallery" target="_blank" rel="noopener noreferrer">
              Preview Live Gallery
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => openCreateModal('video')}
            className="gap-1.5"
          >
            <Film size={15} aria-hidden="true" />
            Add Video
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => openCreateModal('image')}
            className="gap-1.5"
          >
            <Plus size={15} aria-hidden="true" />
            Add Photo
          </Button>
        </div>
      </div>

      {/* Live status feedback banner */}
      <div aria-live="polite">
        <AnimatePresence>
          {banner && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={springConfig.snappy}
              className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
                banner.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {banner.type === 'success' ? (
                  <CheckCircle2 size={16} className="shrink-0" aria-hidden="true" />
                ) : (
                  <AlertCircle size={16} className="shrink-0" aria-hidden="true" />
                )}
                <span>{banner.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setBanner(null)}
                aria-label="Dismiss notification"
                className="text-current/70 hover:text-current p-1 rounded-md"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Media', value: items.length, color: 'text-foreground' },
          { label: 'Photos', value: totalPhotos, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Videos', value: totalVideos, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Published / Hidden', value: `${publishedCount} / ${hiddenCount}`, color: 'text-emerald-600 dark:text-emerald-400' },
        ].map(stat => (
          <Card key={stat.label} className="border border-border/80 shadow-none">
            <CardContent className="p-4">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
              <p className={`text-xl font-bold mt-1 tabular-nums ${stat.color}`}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 p-1 bg-muted/60 border border-border/60 rounded-xl self-start">
          {(
            [
              { label: `All (${items.length})`, value: 'all' },
              { label: `Photos (${totalPhotos})`, value: 'image' },
              { label: `Videos (${totalVideos})`, value: 'video' },
              { label: `Hidden (${hiddenCount})`, value: 'hidden' },
            ] as const
          ).map(tab => {
            const isActive = filter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                aria-pressed={isActive}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors select-none inline-flex items-center justify-center ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <search className="w-full sm:w-72">
          <div className="relative">
            <Label htmlFor="gallery-search-input" className="sr-only">
              Search gallery photos and videos
            </Label>
            <Search
              size={14}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              id="gallery-search-input"
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by title, caption, or file..."
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="pl-8 h-9 text-xs"
            />
          </div>
        </search>
      </div>

      {/* Media Grid */}
      {filteredItems.length === 0 ? (
        <Card className="border border-dashed border-border/80 bg-muted/20 p-12 text-center shadow-none">
          <Images size={40} className="mx-auto text-muted-foreground/40 mb-3" aria-hidden="true" />
          <p className="text-muted-foreground text-sm">
            No gallery images or videos match the current filter.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => openCreateModal('image')}>
              Add Photo
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => openCreateModal('video')}>
              Add Video
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredItems.map((item, idx) => {
            const isBusy = busyId === item.id;
            return (
              <Card
                key={item.id}
                className={`border shadow-none transition-all flex flex-col justify-between overflow-hidden ${
                  item.is_published
                    ? 'border-border/80 hover:border-border'
                    : 'border-dashed border-amber-400/60 bg-muted/10 opacity-85'
                }`}
              >
                <div>
                  {/* Media Preview Frame */}
                  <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden border-b border-border/60">
                    {item.media_type === 'video' ? (
                      <video
                        src={item.src}
                        controls
                        preload="metadata"
                        playsInline
                        width={640}
                        height={360}
                        aria-label={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={item.src}
                        alt={item.alt_text || item.caption || item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized={item.src.startsWith('data:')}
                        className="object-cover"
                      />
                    )}

                    {/* Top-left badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold backdrop-blur-md border ${
                          item.media_type === 'video'
                            ? 'bg-amber-950/80 text-amber-200 border-amber-700/60'
                            : 'bg-blue-950/80 text-blue-200 border-blue-700/60'
                        }`}
                      >
                        {item.media_type === 'video' ? (
                          <Film size={11} aria-hidden="true" />
                        ) : (
                          <ImageIcon size={11} aria-hidden="true" />
                        )}
                        {item.media_type === 'video' ? 'Video' : 'Photo'}
                      </span>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold backdrop-blur-md border ${
                          item.is_published
                            ? 'bg-emerald-950/80 text-emerald-200 border-emerald-700/60'
                            : 'bg-zinc-900/85 text-zinc-300 border-zinc-700'
                        }`}
                      >
                        {item.is_published ? 'Published' : 'Hidden'}
                      </span>
                    </div>

                    {/* Top-right order badge */}
                    <div className="absolute top-2.5 right-2.5 pointer-events-none">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-black/75 text-white border border-white/15">
                        #{item.display_order}
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pb-2 pt-3.5">
                    <CardTitle className="text-sm font-semibold tracking-normal normal-case line-clamp-1">
                      {item.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2 pt-0 text-xs text-muted-foreground">
                    <p className="line-clamp-2 min-h-[2.25rem]">
                      {item.caption || item.alt_text || 'No caption provided.'}
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground/80 truncate" title={item.src}>
                      {item.src}
                    </p>
                  </CardContent>
                </div>

                <CardFooter className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => openEditModal(item)}
                      className="h-8 px-2.5 text-xs gap-1"
                    >
                      <Pencil size={12} aria-hidden="true" />
                      Edit
                      <span className="sr-only"> {item.title}</span>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isBusy}
                      aria-pressed={item.is_published}
                      onClick={() => handleTogglePublish(item)}
                      className="h-8 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                    >
                      {item.is_published ? (
                        <>
                          <EyeOff size={13} aria-hidden="true" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye size={13} aria-hidden="true" />
                          Publish
                        </>
                      )}
                      <span className="sr-only"> {item.title}</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={isBusy || idx === 0}
                      onClick={() => handleMoveOrder(item, 'up')}
                      className="h-7 w-7"
                    >
                      <ArrowUp size={13} aria-hidden="true" />
                      <span className="sr-only">Move {item.title} earlier</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={isBusy || idx === filteredItems.length - 1}
                      onClick={() => handleMoveOrder(item, 'down')}
                      className="h-7 w-7"
                    >
                      <ArrowDown size={13} aria-hidden="true" />
                      <span className="sr-only">Move {item.title} later</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={isBusy}
                      onClick={() => handleDelete(item)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={13} aria-hidden="true" />
                      <span className="sr-only">Delete {item.title}</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Native Modal Dialog (<dialog closedby="any">) for Creating & Editing Gallery Media */}
      <dialog
        ref={dialogRef}
        closedby="any"
        aria-labelledby="gallery-modal-title"
        className="m-auto w-full max-w-xl rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-xs open:animate-in open:fade-in-0 open:zoom-in-95"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 id="gallery-modal-title" className="text-base font-bold text-foreground">
              {editingItem ? `Edit Gallery ${mediaType === 'video' ? 'Video' : 'Photo'}` : 'Add Gallery Media'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {editingItem
                ? 'Update title, caption, visibility, or upload a replacement file.'
                : 'Upload a new club photo or video or link an existing media path.'}
            </p>
          </div>
          <form method="dialog">
            <Button type="submit" variant="ghost" size="icon-sm" aria-label="Close modal">
              <X size={16} aria-hidden="true" />
            </Button>
          </form>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {formError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive"
            >
              <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{formError}</span>
            </div>
          )}

          {/* Media Type Radio Group (2 options -> visible radios per forms guidance) */}
          <fieldset className="space-y-2">
            <legend className="text-xs font-semibold text-foreground">Media Type</legend>
            <div className="grid grid-cols-2 gap-2.5">
              {(
                [
                  { value: 'image', label: 'Photo / Image', icon: ImageIcon },
                  { value: 'video', label: 'Video Clip (MP4/WebM)', icon: Film },
                ] as const
              ).map(option => {
                const Icon = option.icon;
                const checked = mediaType === option.value;
                return (
                  <label
                    key={option.value}
                    htmlFor={`media-type-${option.value}`}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-xs font-medium cursor-pointer transition-colors ${
                      checked
                        ? 'border-primary bg-primary/8 text-foreground ring-1 ring-primary'
                        : 'border-border hover:bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    <input
                      type="radio"
                      id={`media-type-${option.value}`}
                      name="media_type"
                      value={option.value}
                      checked={checked}
                      onChange={() => setMediaType(option.value)}
                      className="accent-primary"
                    />
                    <Icon size={15} className={checked ? 'text-primary' : ''} aria-hidden="true" />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Source Method Radio Group */}
          <fieldset className="space-y-2">
            <legend className="text-xs font-semibold text-foreground">Media Source</legend>
            <div className="grid grid-cols-2 gap-2.5">
              {(
                [
                  { value: 'upload', label: editingItem ? 'Upload Replacement File' : 'Upload File from Device', icon: Upload },
                  { value: 'url', label: 'Media Path or URL', icon: LinkIcon },
                ] as const
              ).map(option => {
                const Icon = option.icon;
                const checked = sourceMode === option.value;
                return (
                  <label
                    key={option.value}
                    htmlFor={`source-mode-${option.value}`}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-medium cursor-pointer transition-colors ${
                      checked
                        ? 'border-primary bg-primary/8 text-foreground'
                        : 'border-border hover:bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    <input
                      type="radio"
                      id={`source-mode-${option.value}`}
                      name="source_mode"
                      value={option.value}
                      checked={checked}
                      onChange={() => setSourceMode(option.value)}
                      className="accent-primary"
                    />
                    <Icon size={14} aria-hidden="true" />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {sourceMode === 'upload' ? (
            <div className="space-y-1.5">
              <Label htmlFor="gallery-file-upload">
                {mediaType === 'video' ? 'Select Video File (.mp4, .webm, .mov)' : 'Select Image File (.jpg, .png, .webp)'}
              </Label>
              <p id="gallery-file-hint" className="text-[11px] text-muted-foreground">
                Uploaded files are saved to <code>/images/club/</code> and immediately available on the site.
              </p>
              <Input
                id="gallery-file-upload"
                name="file"
                type="file"
                accept={mediaType === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'image/jpeg,image/png,image/webp,image/gif'}
                aria-describedby="gallery-file-hint"
                onChange={handleFileChange}
                className="cursor-pointer text-xs file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-primary"
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="gallery-src-input">Media Path or HTTPS URL</Label>
              <p id="gallery-src-hint" className="text-[11px] text-muted-foreground">
                Example: <code>/images/club/members-at-event.jpeg</code> or <code>/images/club/event.mp4</code>
              </p>
              <Input
                id="gallery-src-input"
                name="src"
                type="text"
                value={srcInput}
                onChange={e => setSrcInput(e.target.value)}
                aria-describedby="gallery-src-hint"
                placeholder={mediaType === 'video' ? '/images/club/event.mp4' : '/images/club/photo.jpeg'}
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
            </div>
          )}

          {/* Live Preview */}
          {activePreviewSrc && (
            <div className="rounded-xl border border-border/80 bg-zinc-950 overflow-hidden aspect-video relative max-h-48 mx-auto">
              {mediaType === 'video' ? (
                <video
                  src={activePreviewSrc}
                  controls
                  preload="metadata"
                  width={480}
                  height={270}
                  className="h-full w-full object-contain"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={activePreviewSrc}
                  alt={altText || title || 'Media preview'}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="gallery-title-input">Title *</Label>
            <Input
              id="gallery-title-input"
              name="title"
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. First Anniversary Charity Outreach"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gallery-caption-input">Caption / Story</Label>
            <Textarea
              id="gallery-caption-input"
              name="caption"
              rows={2}
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Describe the moment, event, or members featured..."
            />
          </div>

          {mediaType === 'image' && (
            <div className="space-y-1.5">
              <Label htmlFor="gallery-alt-input">Accessible Alt Text</Label>
              <p id="gallery-alt-hint" className="text-[11px] text-muted-foreground">
                Used by screen readers and lightbox captions. Leave blank to reuse the caption.
              </p>
              <Input
                id="gallery-alt-input"
                name="alt_text"
                type="text"
                aria-describedby="gallery-alt-hint"
                value={altText}
                onChange={e => setAltText(e.target.value)}
                placeholder="Descriptive text for screen readers"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="gallery-category-input">Category</Label>
              <Input
                id="gallery-category-input"
                name="category"
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="club, events, outreach"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gallery-order-input">Display Order</Label>
              <Input
                id="gallery-order-input"
                name="display_order"
                type="number"
                min={0}
                value={displayOrder}
                onChange={e => setDisplayOrder(e.target.value)}
              />
            </div>

            <div className="flex items-end pb-1">
              <label
                htmlFor="gallery-published-checkbox"
                className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none py-2"
              >
                <input
                  id="gallery-published-checkbox"
                  name="is_published"
                  type="checkbox"
                  checked={isPublished}
                  onChange={e => setIsPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <span>Published on website</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <motion.div whileTap={tapScale}>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? 'Saving…'
                  : editingItem
                    ? 'Save Changes'
                    : `Add ${mediaType === 'video' ? 'Video' : 'Photo'}`}
              </Button>
            </motion.div>
          </div>
        </form>
      </dialog>
    </div>
  );
}
