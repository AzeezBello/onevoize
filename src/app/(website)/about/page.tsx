import Link from 'next/link';
import { SectionTitle } from '@/components/SectionTitle';
import { siteConfig } from '@/lib/site';

const trustees = [
  ['Olaiya Ibrahim Olatunbosun', 'President', '/images/trustee-portraits/olaiya-ibrahim.jpeg'],
  ['Kabiru Adesanya', 'Public Relations Officer', '/images/trustee-portraits/kabiru-adesanya.jpeg'],
  ['Waleade Idowu Aseniyi', 'Social Secretary', '/images/trustee-portraits/waleade-idowu.jpeg'],
  ['Olufemi Jeje', 'Financial Secretary', '/images/trustee-portraits/olufemi-jeje.jpeg'],
  ['Awogbadebo Alabi Mobolaji', 'General Secretary', '/images/trustee-portraits/awogbadebo-alabi.jpeg'],
  ['Bariyi Fowora Shoniyi', 'Assistant General Secretary', '/images/trustee-portraits/bariyi-fowora-shoniyi.jpeg'],
];

const governingBody = [
  'President',
  'Vice President',
  'General Secretary',
  'Treasurer',
  'Provost / Public Relations Officer',
  'Social Secretary',
  'The Trustees',
];

export default function About() {
  return <>
    <section id="about-us" className="section" style={{background:'var(--surface)'}}>
      <div className="container">
        <div className="eyebrow">About Us</div>
        <h1 className="serif" style={{fontSize:'clamp(48px,7vw,78px)',maxWidth:900,lineHeight:1}}>One organisation. One voice. A commitment to giving back.</h1>
        <p style={{maxWidth:760,color:'var(--muted)',fontSize:18,lineHeight:1.7}}>{siteConfig.description}</p>
      </div>
    </section>

    <section id="exco-members" className="section">
      <div className="container">
        <SectionTitle eyebrow="From the Club" title="A community that shows up together." text="Moments from Global Voize Club gatherings, celebrations and member activities."/>
        <div className="club-photo-grid">
          {[
            ['/images/club/members-at-event.jpeg', 'Members at a club event'],
            ['/images/club/club-celebration.jpeg', 'Club celebration'],
            ['/images/club/members-group.jpeg', 'Members together'],
            ['/images/club/club-leaders.jpeg', 'Club leaders'],
          ].map(([src, alt]) => <img key={src} src={src} alt={alt} className="club-photo"/>)}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60}}>
        <SectionTitle eyebrow="Who We Are" title="A community organisation founded on solidarity and service."/>
        <div>
          <p style={{color:'var(--muted)',lineHeight:1.8,fontSize:17}}>ONE VOIZE FRIENDS CLUB OF LAGOS is a not-for-profit and non-political organisation. Its constitution states that the association exists to promote integrity, uplift its members, support one another, give to less privileged people, and advance goodwill, peace, unity and progress.</p>
          <p style={{color:'var(--muted)',lineHeight:1.8,fontSize:17}}>The organisation was incorporated in Nigeria on <strong>{siteConfig.incorporationDate}</strong> as an incorporated trustee. Its registered address is <strong>{siteConfig.registeredAddress}</strong>.</p>
          <Link href="/constitution" className="btn btn-light">Read the full constitution</Link>
        </div>
      </div>
    </section>

    <section id="club-committee" className="section" style={{background:'var(--surface)'}}>
      <div className="container">
        <SectionTitle eyebrow="Aims & Objectives" title="Putting integrity, mutual support and community goodwill into action." text="The constitution identifies the promotion of integrity, mutual uplift, support for one another, giving to less privileged people, goodwill, unity, peace and progress as the association's stated objective."/>
        <div className="grid-auto" style={{marginTop:28}}>
          {['Promote integrity','Uplift ourselves and support each other','Give to less privileged people','Advance goodwill and peace','Promote unity and progress'].map((item,i)=><div key={item} style={{background:'var(--card)',padding:24,borderRadius:20,border:'1px solid var(--border)'}}><div className="eyebrow">0{i+1}</div><h3 className="serif" style={{fontSize:25,margin:'8px 0 0'}}>{item}</h3></div>)}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <SectionTitle eyebrow="Registered Trustees" title="The trustees responsible for the incorporated body." text="The Certificate of Incorporation records the duly appointed trustees of ONE VOIZE FRIENDS CLUB OF LAGOS."/>
        <div className="grid-auto">
          {trustees.map(([name,role,image])=><article key={name} style={{background:'var(--card)',padding:22,borderRadius:22,border:'1px solid var(--border)'}}><img src={image} alt={`${name}, ${role}`} style={{width:'100%',height:230,borderRadius:16,objectFit:'cover',objectPosition:'center'}}/><h3 className="serif" style={{fontSize:25,margin:'18px 0 4px'}}>{name}</h3><div className="eyebrow">{role}</div></article>)}
        </div>
      </div>
    </section>

    <section className="section" style={{background:'var(--surface)'}}>
      <div className="container">
        <SectionTitle eyebrow="Governing Body" title="A defined structure for administration and accountability."/>
        <div className="grid-auto">
          {governingBody.map((role,i)=><div key={role} style={{padding:22,border:'1px solid var(--border)',borderRadius:18,background:'var(--card)'}}><div className="eyebrow">0{i+1}</div><strong>{role}</strong></div>)}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
        <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:22,padding:28}}>
          <div className="eyebrow">Registration</div><h2 className="serif" style={{fontSize:32}}>Corporate Affairs Commission</h2>
          <p style={{color:'var(--muted)',lineHeight:1.7}}>Certificate of Incorporation registration number: <strong>{siteConfig.registrationNumber}</strong></p>
          <p style={{color:'var(--muted)',lineHeight:1.7}}>Tax Identification Number: <strong>{siteConfig.taxIdentificationNumber}</strong></p>
        </div>
        <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:22,padding:28}}>
          <div className="eyebrow">Registered Address</div><h2 className="serif" style={{fontSize:32}}>Lagos, Nigeria</h2>
          <p style={{color:'var(--muted)',lineHeight:1.7}}>{siteConfig.registeredAddress}</p>
        </div>
      </div>
    </section>

    <section className="section" style={{background:'var(--brand)',color:'#fff'}}>
      <div className="container"><SectionTitle eyebrow="Transparency & Governance" title="Trust is built through accountability." text="The organisation's constitution provides for trustees, meetings, financial controls, annual independent auditing and a special clause requiring income and property to be applied solely toward its objectives."/><Link href="/contact" className="btn" style={{background:'var(--card)',color:'var(--brand)'}}>Contact us</Link></div>
    </section>
  </>;
}
