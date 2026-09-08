import Link from 'next/link'
import { SectionTitle } from '@/components/SectionTitle'
import { siteConfig } from '@/lib/site'

const objectives = [
  'Uplift ourselves and support each other.',
  'Give to less privileged people in Africa.',
  'Ensure Global Voize members are ambassadors wherever they are invited.',
  'Ensure Global Voize members leave every outing with a convoy.',
]

const membershipRules = [
  'Membership is open to adults who are responsible members of society.',
  'Membership may be regular or honorary.',
  'Members shall keep to the Global Voize Club constitution.',
  'All regular members are allowed to vote in club elections.',
  'New members must be well known to at least one existing member, and the club shall admit no more than two new members yearly.',
]

const loanRules = [
  ['Membership', 'Only active, long-standing members are typically eligible for loans. This ensures that a loan is granted to someone who has demonstrated commitment to the club.'],
  ['Purpose of loan', "A loan may be granted for a specific purpose that benefits a member, such as an emergency, education, or a small business initiative. The purpose should align with the club's values."],
  ['Loan amount', "The loan amount may be limited based on the member's contributions and the club's available financial resources."],
  ['Repayment terms', 'The loan agreement shall state the repayment schedule, interest if any, and penalties for missed payments.'],
  ['Interest rates', 'If interest is charged, it shall be reasonable and reflect the financial status of the club and the purpose of the loan. Interest may not always be charged.'],
  ['Collateral or guarantee', 'Fifty per cent of members must provide collateral or guarantee for the borrower.'],
  ['Approval process', 'Loan approval may require a vote by members or a review by a loan committee to ensure transparency and fairness.'],
  ['Loan term limits', 'A loan may have a maximum duration, such as 12 or 24 months, after which the borrower must repay the full amount.'],
  ['Good standing', 'The member seeking a loan must be in good standing, with no outstanding dues or disciplinary action.'],
  ['Default consequences', 'Consequences for failure to repay may include suspension of club privileges, legal action, or additional fees.'],
  ['Loan documentation', 'A written agreement shall be signed by the borrower and the club to formalise the terms and provide legal protection.'],
]

const offices = [
  ['Club President', 'Sets the standard for member behaviour and club culture; oversees the mission and vision; mediates disputes; and works with executives on budgets and activities.'],
  ['Vice President', "Supports the President's decisions and directives; assumes the President's duties in their absence; communicates with members; and collaborates on club growth and sustainability."],
  ['Secretary', 'Records accurate minutes and key discussions; liaises with external organisations, stakeholders and partners; prepares meeting agendas with the President; and ensures the club follows its bylaws and policies.'],
  ['Treasurer', "Prepares the annual budget; tracks income and expenses; maintains accurate financial records; presents regular financial updates; and keeps important documents in compliance with legal requirements."],
  ['Provost', 'Ensures members follow the club rules, bylaws and code of conduct during meetings, and upholds the ethical standards of the club.'],
  ['Public Relations Officer', 'Keeps members informed through email, social media and other channels; promotes club events; and establishes partnerships that support the club\'s goals.'],
  ['Social Secretary', 'Plans and manages parties, fundraisers, outings and other events; ensures they align with club values; manages event budgets; liaises with vendors; and maintains event records, attendance and feedback.'],
  ['Disciplinary Committee', 'Conducts disciplinary hearings, enforces club rules, investigates complaints, recommends or imposes sanctions, and helps resolve disputes.'],
]

const conductRules = [
  'Members shall uphold the ethical standards and values of the club.',
  'Any member who misbehaves at a club outing or at an outing to which the club was not invited shall be fined 100,000 Naira through the Disciplinary Committee.',
  'A member who misuses the club platform with unwanted posts shall be fined 10,000 Naira.',
  'All members must wear the club uniform, cap and mofila at all social outings.',
]

function Article({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <section style={{ padding: '44px 0', borderTop: '1px solid var(--border)' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 28 }} className="constitution-article">
      <div className="eyebrow">Article {number}</div>
      <div>
        <h2 className="serif" style={{ fontSize: 'clamp(30px,4vw,46px)', lineHeight: 1.05, margin: '0 0 24px' }}>{title}</h2>
        {children}
      </div>
    </div>
  </section>
}

function Copy({ children }: { children: React.ReactNode }) {
  return <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: 17, margin: '0 0 18px' }}>{children}</p>
}

function BulletList({ items }: { items: string[] }) {
  return <ul style={{ margin: 0, paddingLeft: 22, color: 'var(--muted)', lineHeight: 1.8, fontSize: 17 }}>{items.map(item => <li key={item} style={{ marginBottom: 10 }}>{item}</li>)}</ul>
}

export default function Constitution() {
  return <>
    <section className="section" style={{ background: '#eef1eb' }}>
      <div className="container">
        <div className="eyebrow">Governance Document</div>
        <h1 className="serif" style={{ fontSize: 'clamp(48px,7vw,78px)', maxWidth: 900, lineHeight: 1, marginBottom: 24 }}>Global Voize Club Constitution</h1>
        <p style={{ maxWidth: 700, color: 'var(--muted)', fontSize: 18, lineHeight: 1.7 }}>The guiding rules, membership standards, governance structure and shared responsibilities of Global Voize Club.</p>
        <p style={{ maxWidth: 700, color: 'var(--muted)', lineHeight: 1.7, marginTop: 26 }}><strong>Registered address:</strong> {siteConfig.registeredAddress}</p>
      </div>
    </section>

    <main className="section">
      <div className="container" style={{ maxWidth: 1000 }}>
        <Article number="1" title="Name and Address">
          <Copy>The name of the organisation is <strong>GLOBAL VOIZE CLUB (GVC)</strong>.</Copy>
          <Copy><strong>Address:</strong> 12A Hogan Bassey Crescent, Surulere, Lagos.</Copy>
        </Article>

        <Article number="2" title="Aims and Objectives of the Club">
          <BulletList items={objectives} />
        </Article>

        <Article number="3" title="Membership">
          <SectionTitle eyebrow="Eligibility and rights" title="Membership standards" />
          <BulletList items={membershipRules} />
          <div style={{ marginTop: 30, padding: 24, background: '#f7f5ef', borderRadius: 18 }}>
            <h3 className="serif" style={{ fontSize: 28, margin: '0 0 14px' }}>Dues and fees</h3>
            <BulletList items={[
              'One million Naira monthly contribution (Ajo), for members who can participate.',
              'A mandatory contribution of 50,000 Naira for all members, used towards charity and less privileged people in Africa.',
              'A new member must pay a non-refundable registration fee of one million Naira.',
              'Termination and new membership shall be conducted and screened through the appointed Disciplinary Committee.',
            ]} />
          </div>
        </Article>

        <Article number="3B" title="Loan Membership">
          <div style={{ display: 'grid', gap: 16 }}>{loanRules.map(([label, text]) => <div key={label} style={{ paddingBottom: 16, borderBottom: '1px solid var(--border)' }}><strong>{label}:</strong><span style={{ color: 'var(--muted)', lineHeight: 1.7 }}> {text}</span></div>)}</div>
        </Article>

        <Article number="4" title="Governance and Club Structure">
          <Copy>The Executive Committee shall consist of:</Copy>
          <BulletList items={['Club President', 'Vice President', 'Secretary', 'Treasurer', 'Provost / Public Relations Officer', 'Social Secretary', 'Disciplinary Committee']} />
          <h3 className="serif" style={{ fontSize: 30, margin: '38px 0 18px' }}>Roles and responsibilities</h3>
          <div style={{ display: 'grid', gap: 14 }}>{offices.map(([office, responsibility]) => <div key={office} style={{ padding: 20, border: '1px solid var(--border)', borderRadius: 14 }}><strong>{office}</strong><p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: '8px 0 0' }}>{responsibility}</p></div>)}</div>
          <div style={{ marginTop: 30 }}>
            <Copy><strong>Election of officers:</strong> The club shall state the process for electing officers, including eligibility, nominations and voting.</Copy>
            <Copy><strong>Terms of office:</strong> Officers shall serve for a term of four years.</Copy>
          </div>
        </Article>

        <Article number="5" title="General Meetings">
          <BulletList items={[
            'General meetings shall be held every Sunday at 8:00 p.m. UK and Nigeria time, and 12:00 noon in America and Canada.',
            'The quorum required to commence a meeting is eight members.',
            'The club shall describe and follow its voting process.',
            'The Public Relations Officer shall notify all members of meetings.',
            'A member absent from a general meeting twice without reason shall pay a 20,000 Naira fine before the next meeting.',
            'A member who will be absent shall inform the Secretary or President at least two hours before the general meeting.',
            'Lateness shall attract a fine of 5,000 Naira.',
            'Posting an unauthorised post on the club platform shall attract a fine of 20,000 Naira.',
          ]} />
        </Article>

        <Article number="6" title="Finances">
          <BulletList items={[
            'All club expenses and contributions must be included in the meeting agenda.',
            'All members shall be aware of every expense and the total amount held by the club.',
            'The outing contribution for a member\'s party shall be 100,000 Naira.',
            'A member shall be entitled to one direct outing, not extended family, and the outing contribution must be handed over one week before the occasion.',
          ]} />
        </Article>

        <Article number="7" title="Audit and Dissolution">
          <Copy><strong>Audit:</strong> The club shall state if and when financial audits are required.</Copy>
          <Copy><strong>Dissolution:</strong> The club shall outline what will happen to its assets in the case of dissolution.</Copy>
        </Article>

        <Article number="8" title="Amendments">
          <Copy><strong>Amendment:</strong> The club shall outline the process for proposing amendments to this constitution.</Copy>
          <Copy><strong>Approval of amendment:</strong> Amendments shall be approved through the stated voting process, requiring a two-thirds vote or the required majority.</Copy>
        </Article>

        <Article number="9" title="Code of Conduct">
          <BulletList items={conductRules} />
        </Article>

        <section style={{ marginTop: 18, padding: 36, background: 'var(--brand)', color: '#fff', borderRadius: 22, textAlign: 'center' }}>
          <div className="eyebrow" style={{ color: '#d8a84e' }}>Our Motto</div>
          <h2 className="serif" style={{ fontSize: 'clamp(34px,5vw,52px)', margin: '12px 0 0' }}>GLOBAL VOIZE... One Voize</h2>
        </section>
        <div style={{ marginTop: 30 }}><Link href="/about" className="btn btn-light">Back to About</Link></div>
      </div>
    </main>
  </>
}
