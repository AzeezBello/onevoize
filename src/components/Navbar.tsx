'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileNav } from '@/components/MobileNav';

export function Navbar(){
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  };

  return <header className="site-navbar" style={{background:'transparent',borderBottom:'1px solid rgba(255,255,255,.12)',position:'fixed',top:0,left:0,right:0,zIndex:50,backdropFilter:'blur(4px)'}}><div className="container site-navbar-inner" style={{height:76,display:'flex',alignItems:'center',justifyContent:'space-between',gap:20}}><Link href="/" aria-label="One Voize Friends Club of Lagos home" style={{display:'flex',alignItems:'center',fontWeight:800}}><img src="/images/ONE VOICE LOGO 1.png" alt="One Voize Friends Club of Lagos logo" style={{width:120,height:'auto',objectFit:'contain',display:'block'}}/></Link><nav style={{display:'flex',gap:15,alignItems:'center'}} className="desktop-nav"><Link className={`nav-link ${isActive('/') ? 'active' : ''}`} href="/" style={{color:'#fff'}}>Home</Link><details className="nav-dropdown"><summary className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About us</summary><div className="nav-dropdown-menu"><Link className={`nav-dropdown-link ${isActive('/about#about-us') ? 'active' : ''}`} href="/about#about-us">About us</Link><Link className={`nav-dropdown-link ${isActive('/about#exco-members') ? 'active' : ''}`} href="/about#exco-members">Exco / members</Link><Link className={`nav-dropdown-link ${isActive('/about#club-committee') ? 'active' : ''}`} href="/about#club-committee">Club committee</Link></div></details><Link className={`nav-link ${isActive('/gallery') ? 'active' : ''}`} href="/gallery" style={{color:'#fff'}}>Gallery</Link><Link className={`nav-link ${isActive('/membership') ? 'active' : ''}`} href="/membership" style={{color:'#fff'}}>Join us</Link><Link className="btn btn-primary" href="/donate">Donate</Link><ThemeToggle/></nav><MobileNav/></div><style>{`.desktop-nav{display:flex}@media(max-width:900px){.desktop-nav{display:none!important}}`}</style></header>
}
