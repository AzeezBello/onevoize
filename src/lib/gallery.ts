export type GalleryPhoto = [src: string, alt: string]
export type GalleryVideo = { src: string; title: string; caption: string }

export const clubPhotos: GalleryPhoto[] = [
  ['/images/club/gvc-at-mother-less-home-in-surulere.jpeg', 'Gvc at mother less home in surulere for Charity Donation towards our first year anniversary'],
  ['/images/club/members-at-event.jpeg', 'Three club members in white polo shirts on a green carpet in front of the Global Voize anniversary banner'],
  ['/images/club/club-celebration.jpeg', 'A club member wearing a blue club sash and traditional cap among guests dressed in white lace at a celebration'],
  ['/images/club/members-group.jpeg', 'Club members in matching white polo shirts lined up outside a care centre during an outreach visit'],
  ['/images/club/club-leaders.jpeg', 'Three club members in white polo shirts holding bottled water in front of the Global Voize welcome banner'],
]

export const anniversaryArt = {
  src: '/images/club/first-anniversary.png',
  width: 1921,
  height: 946,
  alt: '1st Anniversary Celebration artwork with the One Voize Friends Club logo',
}

export const clubVideos: GalleryVideo[] = [
  { src: '/images/club/event-setup.mp4', title: 'Anniversary preparations', caption: 'Awogbadebo Alabi Mobolaji, General Secretary, during preparations for the club\'s first anniversary celebration.' },
  { src: '/images/club/event.mp4', title: 'Club event', caption: 'Members and guests at a club gathering.' },
  { src: '/images/club/events.mp4', title: 'Club events', caption: 'Highlights from club outings and gatherings.' },
  { src: '/images/club/k1-wasiu.mp4', title: 'Meeting K1 De Ultimate', caption: 'Sunday Olufemi Jeje introduces the club to King Wasiu Ayinde Marshal (K1 De Ultimate) at an event.' },
]
