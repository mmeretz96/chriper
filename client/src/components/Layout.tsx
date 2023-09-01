import Navbar from "./Navbar";

//component skeleton
const Layout = (props: { children: React.ReactNode; signOut: () => void }) => {
  return (
    <div className="flex flex-col bg-gray-200 h-full items-center">
      <Navbar signOut={props.signOut} />
      <div className="max-w-[1250px] w-full py-6 px-4">{props.children}</div>
    </div>
  );
};
export default Layout;
