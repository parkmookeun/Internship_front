import Header from "@/components/Header";

export default function BoardListLayout({ children }) {
  return (
    <div>
      <Header />
      <br />
      <main>{children}</main>
    </div>
  );
}
