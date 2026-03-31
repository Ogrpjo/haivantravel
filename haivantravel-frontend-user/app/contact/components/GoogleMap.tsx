export default function GoogleMap() {
  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.7651911655435!2d106.61408567655454!3d10.829273058213623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bce2d0946c7%3A0x573e6e27257dd65c!2zMTU0IMSQLiBQaGFuIFbEg24gSOG7m24sIFTDom4gVGjhu5tpIE5o4bqldCwgUXXhuq1uIDEyLCBI4buTIENow60gTWluaCA3Mjk5MzAsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1774011080767!5m2!1sen!2s"
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      ></iframe>
    </div>
  );
}
