import './announciment_banner.css';

const EventAnnouncement = () => {
  return (
    <div className="event-announcement">
      <div className="flames-top" />
      <p>
        <span className="emoji">🔥</span>
        <strong>T-Roger Family</strong> is igniting the stage with the biggest talent showdown of the year!
        From singers and dancers to actors and creatives — your moment is now.
        <br /><br />
        <strong className="highlight">Choose your category and perform!</strong> Spots are burning out fast — grab yours before it’s gone! 
        <span className="emoji">🔥</span>
      </p>
      <div className="flames-bottom" />
    </div>
  );
};

export default EventAnnouncement;
