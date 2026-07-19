import { getProfile } from '@/lib/services/profile.service'
import ContactClient from './ContactClient'

export const metadata = {
  title: 'Contact - My Portfolio',
  description: 'Get in touch with me',
}

export default async function ContactPage() {
  const profile = await getProfile()
  
  return <ContactClient profile={profile} />
}
