import { 
  Hero, 
  Features, 
  ModelsShowcase, 
  WorkflowPreview, 
  RecipesPreview, 
  CTASection, 
  Footer 
} from "@/components/marketing";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <WorkflowPreview />
      <ModelsShowcase />
      <RecipesPreview />
      <CTASection />
      <Footer />
    </>
  );
}
