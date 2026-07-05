import { Header } from "./components/Header";
import { SubmitForm } from "./components/SubmitForm";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <SubmitForm />
        </div>
      </div>
    </main>
  );
}
