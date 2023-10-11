import { GiTakeMyMoney } from "react-icons/gi";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex justify-center">
      <div className="mt-20 px-4 py-8 border rounded-lg border-gray-100 min-w-[400px]">
        <div className="text-3xl  flex justify-center">
          <GiTakeMyMoney />
        </div>
        <div className="text-center mb-12">DreamStarter</div>
        <div>{children}</div>
      </div>
    </section>
  );
}
