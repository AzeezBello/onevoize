import { db } from '@/lib/db';
import { clubPhotos, clubVideos, type GalleryPhoto, type GalleryVideo } from '@/lib/gallery';

export type GalleryItemRecord = {
  id: number;
  media_type: 'image' | 'video';
  src: string;
  title: string;
  caption: string | null;
  alt_text: string | null;
  category: string;
  display_order: number;
  is_published: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
};

let _initialized = false;

/**
 * Ensures the `gallery_items` table exists in Neon DB and seeds it
 * with the initial static photos and videos from `src/lib/gallery.ts`
 * if the table is completely empty.
 */
export async function ensureGalleryReady(): Promise<void> {
  if (_initialized) return;

  await db(`
    CREATE TABLE IF NOT EXISTS gallery_items (
      id            SERIAL PRIMARY KEY,
      media_type    TEXT        NOT NULL DEFAULT 'image'
                                CHECK (media_type IN ('image', 'video')),
      src           TEXT        NOT NULL,
      title         TEXT        NOT NULL,
      caption       TEXT,
      alt_text      TEXT,
      category      TEXT        NOT NULL DEFAULT 'club',
      display_order INT         NOT NULL DEFAULT 0,
      is_published  BOOLEAN     NOT NULL DEFAULT TRUE,
      created_by    INT         REFERENCES users(id),
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const countRows = await db<{ count: string }>('SELECT COUNT(*) as count FROM gallery_items');
  const count = Number(countRows[0]?.count ?? 0);

  if (count === 0) {
    let order = 1;
    for (const [src, alt] of clubPhotos) {
      const shortTitle = alt.length > 64 ? `${alt.slice(0, 61)}...` : alt;
      await db(
        `INSERT INTO gallery_items (media_type, src, title, caption, alt_text, category, display_order, is_published)
         VALUES ('image', $1, $2, $3, $4, 'club', $5, TRUE)`,
        [src, shortTitle, alt, alt, order++],
      );
    }

    for (const video of clubVideos) {
      await db(
        `INSERT INTO gallery_items (media_type, src, title, caption, alt_text, category, display_order, is_published)
         VALUES ('video', $1, $2, $3, $4, 'events', $5, TRUE)`,
        [video.src, video.title, video.caption, video.title, order++],
      );
    }
  }

  _initialized = true;
}

export async function getGalleryItems(options?: {
  mediaType?: 'image' | 'video';
  publishedOnly?: boolean;
}): Promise<GalleryItemRecord[]> {
  try {
    await ensureGalleryReady();

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (options?.mediaType) {
      params.push(options.mediaType);
      conditions.push(`media_type = $${params.length}`);
    }
    if (options?.publishedOnly) {
      conditions.push('is_published = TRUE');
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = await db<GalleryItemRecord>(
      `SELECT * FROM gallery_items ${where} ORDER BY display_order ASC, id ASC`,
      params,
    );
    return rows;
  } catch {
    // Fallback to static items if DB connection is unavailable
    const fallbackImages: GalleryItemRecord[] = clubPhotos.map(([src, alt], idx) => ({
      id: idx + 1,
      media_type: 'image',
      src,
      title: alt.length > 64 ? `${alt.slice(0, 61)}...` : alt,
      caption: alt,
      alt_text: alt,
      category: 'club',
      display_order: idx + 1,
      is_published: true,
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const fallbackVideos: GalleryItemRecord[] = clubVideos.map((v, idx) => ({
      id: fallbackImages.length + idx + 1,
      media_type: 'video',
      src: v.src,
      title: v.title,
      caption: v.caption,
      alt_text: v.title,
      category: 'events',
      display_order: fallbackImages.length + idx + 1,
      is_published: true,
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    let combined = [...fallbackImages, ...fallbackVideos];
    if (options?.mediaType) {
      combined = combined.filter(item => item.media_type === options.mediaType);
    }
    return combined;
  }
}

export async function getPublicGalleryData(): Promise<{
  photos: GalleryPhoto[];
  videos: GalleryVideo[];
}> {
  const items = await getGalleryItems({ publishedOnly: true });
  const imageItems = items.filter(i => i.media_type === 'image');
  const videoItems = items.filter(i => i.media_type === 'video');

  const photos: GalleryPhoto[] =
    imageItems.length > 0
      ? imageItems.map(i => [i.src, i.alt_text || i.caption || i.title])
      : clubPhotos;

  const videos: GalleryVideo[] =
    videoItems.length > 0
      ? videoItems.map(i => ({
          src: i.src,
          title: i.title,
          caption: i.caption || '',
        }))
      : clubVideos;

  return { photos, videos };
}
