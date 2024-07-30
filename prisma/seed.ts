import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const users = [
  { name: 'Nick', avatar: 'https://example.com/nick.jpg', comment: 'Design enthusiast', year: 2023 },
  { name: 'Jon', avatar: 'https://example.com/jon.jpg', comment: 'Tech guru', year: 2022 },
  { name: 'Mackenzie', avatar: 'https://example.com/mackenzie.jpg', comment: 'Art lover', year: 2021 },
]

const mediaObjects = [
  { type: 'Book', title: '1984', creator: 'George Orwell', year: 1949, url: 'https://example.com/1984', image: 'https://example.com/1984.jpg', duration: 328, comment: 'A classic dystopian novel' },
  { type: 'Post', title: 'The Future of AI', creator: 'Tech Insider', year: 2023, url: 'https://example.com/ai-future', image: 'https://example.com/ai.jpg', duration: 10, comment: 'Insightful article on AI advancements' },
  { type: 'Quote', title: 'Be the change', creator: 'Mahatma Gandhi', year: 1913, url: 'https://example.com/gandhi-quote', duration: 0.5, comment: 'Inspirational quote' },
  { type: 'Tweet', title: 'Elon Musk on Mars', creator: '@elonmusk', year: 2023, url: 'https://twitter.com/elonmusk/status/1234567890', duration: 0.2, comment: 'Controversial tweet about Mars colonization' },
  { type: 'Art', title: 'Starry Night', creator: 'Vincent van Gogh', year: 1889, url: 'https://example.com/starry-night', image: 'https://example.com/starry-night.jpg', duration: 5, comment: 'A masterpiece of post-impressionism' },
  { type: 'Film', title: 'Inception', creator: 'Christopher Nolan', year: 2010, url: 'https://example.com/inception', image: 'https://example.com/inception.jpg', duration: 148, comment: 'Mind-bending sci-fi thriller' },
  { type: 'Tiktok', title: 'Viral Dance Challenge', creator: '@dancerextraordinaire', year: 2023, url: 'https://tiktok.com/viral-dance', image: 'https://example.com/tiktok-dance.jpg', duration: 0.5, comment: 'Latest dance craze' },
  { type: 'Youtube', title: 'How to Code in 10 Minutes', creator: 'CodeMaster', year: 2022, url: 'https://youtube.com/code-in-10', image: 'https://example.com/code-tutorial.jpg', duration: 10, comment: 'Quick coding tutorial' },
  { type: 'Music', title: 'Bohemian Rhapsody', creator: 'Queen', year: 1975, url: 'https://example.com/bohemian-rhapsody', image: 'https://example.com/queen-album.jpg', duration: 5.55, comment: 'Legendary rock opera' },
  { type: 'Podcast', title: 'The Daily', creator: 'The New York Times', year: 2023, url: 'https://example.com/the-daily', image: 'https://example.com/the-daily.jpg', duration: 25, comment: 'Daily news podcast' },
]

async function main() {
  console.log(`Start seeding ...`)

  for (const user of users) {
    const createdUser = await prisma.user.create({ data: user })
    console.log(`Created user with id: ${createdUser.id}`)
  }

  const allUsers = await prisma.user.findMany()

  for (const media of mediaObjects) {
    const createdMedia = await prisma.mediaObject.create({
      data: {
        ...media,
        userId: allUsers[Math.floor(Math.random() * allUsers.length)].id
      }
    })
    console.log(`Created media object with id: ${createdMedia.id}`)
  }

  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })