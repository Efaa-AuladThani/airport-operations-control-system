import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ title, children }) {
  return (
    <div className="app-layout">
      {/* Primary application sidebar */}
      <aside className="app-layout__sidebar">
        <Sidebar />
      </aside>

      <div className="app-layout__content">
        {/* Top navigation bar with current page title */}
        <Navbar title={title} />

        {/* Main area where page content is rendered */}
        <main className="app-layout__main" aria-label={title || "Page content"}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
