import React from "react";

const Footer = () => {
  return (
    <div className="bg-neutral">
      <div className="m-auto max-w-7xl bg-neutral">
        <footer className="footer p-10 text-neutral-content">
          <nav>
            <header className="footer-title">Services</header>
            <a className="link-hover link">Branding</a>
            <a className="link-hover link">Design</a>
            <a className="link-hover link">Marketing</a>
            <a className="link-hover link">Advertisement</a>
          </nav>
          <nav>
            <header className="footer-title">Company</header>
            <a className="link-hover link">About us</a>
            <a className="link-hover link">Contact</a>
            <a className="link-hover link">Jobs</a>
            <a className="link-hover link">Press kit</a>
          </nav>
          <nav>
            <header className="footer-title">Legal</header>
            <a className="link-hover link">Terms of use</a>
            <a className="link-hover link">Privacy policy</a>
            <a className="link-hover link">Cookie policy</a>
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
