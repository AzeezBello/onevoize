export type Person = { name: string; role: string; image: string }

/** Registered trustees / executive committee. Names and roles follow the captions supplied with the portraits. */
export const trustees: Person[] = [
  { name: 'Olaiya Ibrahim Olatunbosun', role: 'President', image: '/images/trustee-portraits/olaiya-ibrahim-olatunbosun.jpg' },
  { name: 'Awogbadebo Alabi Mobolaji', role: 'General Secretary', image: '/images/trustee-portraits/awogbadebo-alabi-mobolaji.jpg' },
  { name: 'Sunday Olufemi Jeje', role: 'Financial Secretary', image: '/images/trustee-portraits/sunday-olufemi-jeje.jpg' },
  { name: 'Adebola Kabiru Adesanya', role: 'Public Relations Officer', image: '/images/trustee-portraits/adebola-kabiru-adesanya.jpg' },
  { name: 'Idowu Waleade Aseniyi', role: 'Social Secretary', image: '/images/trustee-portraits/idowu-waleade-aseniyi.jpg' },
  { name: 'Bariyi Fowora Shoniyi', role: 'Assistant Secretary', image: '/images/trustee-portraits/bariyi-fowora-shoniyi.jpg' },
]

/** Trustees featured on the home page. */
export const featuredTrustees = trustees.slice(0, 3)

export const members: Person[] = [
  { name: 'Abdul Silvester Sly', role: 'Member', image: '/images/members/abdul-silvester-sly.jpg' },
  { name: 'Adeyeye Ibrahim', role: 'Member', image: '/images/members/adeyeye-ibrahim.jpg' },
  { name: 'Hakeem Babatunde Salami', role: 'Member', image: '/images/members/hakeem-babatunde-salami.jpg' },
  { name: 'Hon. Olalekan S. Davids (Salaqua)', role: 'Member', image: '/images/members/olalekan-davids-salaqua.jpg' },
  { name: 'Olatunde Isikalu', role: 'Member', image: '/images/members/olatunde-isikalu.jpg' },
  { name: 'Prince Afolabi Olanrewaju', role: 'Member', image: '/images/members/prince-afolabi-olanrewaju.jpg' },
  { name: 'Wasiu Adekunle Shoniyi', role: 'Member', image: '/images/members/wasiu-adekunle-shoniyi.jpg' },
]

export const portraitAlt = ({ name, role }: Person) => role === 'Member' ? `Portrait of ${name}, club member` : `Portrait of ${name}, ${role}`
