import Gift from "@/components/Gift";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="p-24">
      <main className="flex flex-col gap-8 items-center justify-center sm:items-start">
       <div className="flex items-center justify-center w-full">
       <SearchBar/>
       </div>
       <Gift/>
      </main>
    </div>
  );
}
