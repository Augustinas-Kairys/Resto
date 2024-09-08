import  { useState, useEffect } from 'react';
import { FaRegWindowClose } from 'react-icons/fa';
import '../Assets/kitchen.css';
const SoundSettingsPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    const savedVolume = parseFloat(window.localStorage.getItem('volume') || '1');
    const savedMute = window.localStorage.getItem('isMuted') === 'true';

    setVolume(savedVolume);
    setIsMuted(savedMute);
  }, []);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    window.localStorage.setItem('volume', newVolume.toString());
  };

  const handleMuteToggle = () => {
    const newMuteStatus = !isMuted;
    setIsMuted(newMuteStatus);
    window.localStorage.setItem('isMuted', newMuteStatus.toString());
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}> <FaRegWindowClose/></button>
        <h5>Sound Settings</h5>
        <div className="mt-3">
          <label htmlFor="volume-control">Volume: </label>
          <input
            id="volume-control"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            style={{ width: '200px' }}
          />
          <span className="ms-2">{(volume * 100).toFixed(0)}%</span>
        </div>
        <button 
          className={`btn ${isMuted ? 'btn-secondary' : 'btn-danger'} mt-2`}
          onClick={handleMuteToggle}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>
    </div>
  );
};

export default SoundSettingsPopup;
