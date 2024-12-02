import './ResultsList.css'

export default function ResultsList(){

  const handleGoogleMapsClick = () => {
    const lat = 51.03595642415394;  // Replace with actual latitude
    const long = -114.05224606679344;  // Replace with actual longitude

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
    window.open(googleMapsUrl, "_blank");
  };


  return(
  <>
  <div className="resultsList">
    <p>Sample Results</p>
   {[...Array(5)].map((_, index) => (
    <div key={index} className="card">
      <p>Price: $10 per hour</p>
      <p>Distance: 500m away</p>
      <p>0589 Address Way 042</p>
      <button className="GM-button" onClick={handleGoogleMapsClick}>Google Maps</button>
    </div>
  ))}
  
  
  </div>
  </>
)
}