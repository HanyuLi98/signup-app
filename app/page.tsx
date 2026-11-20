import TrainingRegistration from './components/TrainingRegistration'

export default async function Home({ searchParams }: { searchParams: Promise<{ session?: string | string[] }> }) {
  const params = await searchParams
  return <TrainingRegistration initialSessionKey={typeof params.session === 'string' ? params.session : undefined} />
}
