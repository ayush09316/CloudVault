const Backdrop = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-x-0 top-0 h-[1000px] overflow-hidden"
  >
    <div className="cvl-glow" />
    <div className="cvl-grid" />
    <div className="absolute inset-x-0 top-[215px] hidden sm:block">
      <span
        className="cvl-beam"
        style={{ '--d': '0.6s' } as React.CSSProperties}
      />
    </div>
    <div className="absolute inset-x-0 top-[503px] hidden sm:block">
      <span
        className="cvl-beam"
        style={{ '--d': '5.2s' } as React.CSSProperties}
      />
    </div>
    <div className="absolute inset-y-0 left-[1367px] hidden 2xl:block">
      <span
        className="cvl-beam cvl-beam-v"
        style={{ '--d': '2.8s' } as React.CSSProperties}
      />
    </div>
    <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent to-background" />
  </div>
);

export default Backdrop;
