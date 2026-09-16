import Image from 'next/image';
import Link from 'next/link';
import { SectionTitle } from '@/components/SectionTitle';
import { PageHero } from '@/components/PageHero';
import { PeopleGrid } from '@/components/PersonCard';
import { siteConfig } from '@/lib/site';
import { trustees, members } from '@/lib/people';
import { clubPhotos } from '@/lib/gallery';

const cardStyle = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 22, padding: 22 } as const;
const committees = [
  ['Disciplinary Committee', 'Promotes good conduct, investigates complaints, conducts hearings and recommends fair resolutions.'],
  ['Finance and Audit Committee', 'Supports transparent budgeting, financial records, contributions and periodic review.'],
  ['Events and Social Committee', 'Plans outings, celebrations, fundraisers and member activities in line with club values.'],
  ['Welfare and Charity Committee', 'Coordinates support for members and charitable giving to less privileged people in Africa.'],
]

export default function About() {
  return <>
    <PageHero id="about-us" eyebrow="About us" title="One organisation. One voice." text={siteConfig.description} action={{ label: 'Read our constitution', href: '/constitution' }}/>

    <section className="section">
      <div className="container">
        <SectionTitle eyebrow="From the Club" title="A community that shows up together." text="Moments from Global Voize Club gatherings, celebrations and member activities."/>
        <div className="club-photo-grid">
          {clubPhotos.map(([src, alt]) => <div key={src} className="club-photo"><Image src={src} alt={alt} fill sizes="(max-width: 480px) 100vw, (max-width: 800px) 50vw, 25vw"/></div>)}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container two-col">
        <SectionTitle eyebrow="Who We Are" title="A community organisation founded on solidarity and service."/>
        <div>
          <p className="muted" style={{lineHeight:1.8,fontSize:17}}>ONE VOIZE FRIENDS CLUB OF LAGOS is a not-for-profit and non-political organisation. Its constitution states that the association exists to promote integrity, uplift its members, support one another, give to less privileged people, and advance goodwill, peace, unity and progress.</p>
          <p className="muted" style={{lineHeight:1.8,fontSize:17}}>The organisation was incorporated in Nigeria on <strong>{siteConfig.incorporationDate}</strong> as an incorporated trustee. Its registered address is <strong>{siteConfig.registeredAddress}</strong>.</p>
          <Link href="/constitution" className="btn btn-light" style={{marginTop:24}}>Read the full constitution</Link>
        </div>
      </div>
    </section>

    <section className="section" style={{background:'var(--surface)'}}>
      <div className="container">
        <SectionTitle eyebrow="Aims & Objectives" title="Putting integrity, mutual support and community goodwill into action." text="The constitution identifies the promotion of integrity, mutual uplift, support for one another, giving to less privileged people, goodwill, unity, peace and progress as the association's stated objective."/>
        <div className="grid-auto" style={{marginTop:28}}>
          {['Promote integrity','Uplift ourselves and support each other','Give to less privileged people','Advance goodwill and peace','Promote unity and progress'].map((item,i)=><div key={item} style={{background:'var(--card)',padding:24,borderRadius:20,border:'1px solid var(--border)'}}><div className="eyebrow">0{i+1}</div><h3 className="serif" style={{fontSize:25,margin:'8px 0 0'}}>{item}</h3></div>)}
        </div>
      </div>
    </section>

    <section id="exco-members" className="section">
      <div className="container">
        <SectionTitle eyebrow="Registered Trustees" title="The trustees responsible for the incorporated body." text="The Certificate of Incorporation records the duly appointed trustees of ONE VOIZE FRIENDS CLUB OF LAGOS."/>
        <PeopleGrid people={trustees}/>
        <div style={{marginTop:64}}>
          <SectionTitle eyebrow="Club Members" title="The people who make the club."/>
          <PeopleGrid people={members}/>
        </div>
      </div>
    </section>


    <section id="club-committee" className="section">
      <div className="container">
        <div className="grid-auto">{committees.map(([title, description], index) => <article key={title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 26 }}>
          <div className="eyebrow">0{index + 1}</div>
          <h2 className="serif" style={{ fontSize: 29 }}>{title}</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>{description}</p></article>)}
        </div>
      </div>
    </section>
    
    
    <section className="section">
      <div className="container two-col two-col-tight">
        <div style={{...cardStyle,padding:28}}>
          <div className="eyebrow">Registration</div><h2 className="serif" style={{fontSize:32,margin:'8px 0 12px'}}>Corporate Affairs Commission</h2>
          <p className="muted" style={{lineHeight:1.7}}>Certificate of Incorporation registration number: <strong>{siteConfig.registrationNumber}</strong></p>
          <p className="muted" style={{lineHeight:1.7}}>Tax Identification Number: <strong>{siteConfig.taxIdentificationNumber}</strong></p>
        </div>
        <div style={{...cardStyle,padding:28}}>
          <div className="eyebrow">Registered Address</div><h2 className="serif" style={{fontSize:32,margin:'8px 0 12px'}}>Lagos, Nigeria</h2>
          <p className="muted" style={{lineHeight:1.7}}>{siteConfig.registeredAddress}</p>
        </div>
      </div>
    </section>

    <section className="section" style={{background:'var(--brand)',color:'#fff'}}>
      <div className="container"><SectionTitle eyebrow="Transparency & Governance" title="Trust is built through accountability." text="The organisation's constitution provides for trustees, meetings, financial controls, annual independent auditing and a special clause requiring income and property to be applied solely toward its objectives." light/><Link href="/contact" className="btn btn-gold">Contact us</Link></div>
    </section>
  </>;
}
