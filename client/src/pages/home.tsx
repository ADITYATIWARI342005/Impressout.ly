import { useQuery } from "@tanstack/react-query";
import type { Resume, Portfolio, CoverLetter, Project } from "@/types/api";

export default function Home() {
  const { data: resumes } = useQuery<Resume[]>({ queryKey: ["/api/resumes"] });
  const { data: portfolios } = useQuery<Portfolio[]>({ queryKey: ["/api/portfolios"] });
  const { data: coverLetters } = useQuery<CoverLetter[]>({ queryKey: ["/api/cover-letters"] });
  const { data: projects } = useQuery<Project[]>({ queryKey: ["/api/projects"] });
  return <div>Home</div>;
}
