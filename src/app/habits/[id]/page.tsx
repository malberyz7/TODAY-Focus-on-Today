import { HabitDetailView } from "@/components/habit-detail-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function HabitPage({ params }: PageProps) {
  const { id } = await params;
  return <HabitDetailView habitId={decodeURIComponent(id)} />;
}
