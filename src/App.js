import React, { useState, useEffect, useRef } from 'react';

// --- YOUR PERSONAL FIREBASE KEYS ---
const firebaseConfig = {
  apiKey: "AIzaSyAZ2sBoHHEbS-kfhfJRqW6W3eYKRAaUUR4",
  authDomain: "setu-652cf.firebaseapp.com",
  projectId: "setu-652cf",
  storageBucket: "setu-652cf.firebasestorage.app",
  messagingSenderId: "258865594123",
  appId: "1:258865594123:web:7bdccf77823073a4f1ec0e"
};

// Initialize Firebase & Database
let auth = null;
let googleProvider = null;
let db = null;

if (window.firebase) {
  if (!window.firebase.apps.length) {
    window.firebase.initializeApp(firebaseConfig);
  }
  auth = window.firebase.auth();
  googleProvider = new window.firebase.auth.GoogleAuthProvider();
  db = window.firebase.firestore();
}

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Yatra+One&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// ==========================================
// RUSTIC / PROFESSIONAL SVG ICONS 
// ==========================================
const Icon = {
  Mic: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>,
  MicOff: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.88"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>,
  Camera: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  CameraOff: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Screen: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Image: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Zap: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Megaphone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
  Star: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Send: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Chat: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Trophy: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  Settings: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  TreeLogo: () => <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-8"/><path d="M12 14c-2.5-2.5-2-6-2-6s1.5-1 3-1 3 1 3 1 .5 3.5-2 6"/><path d="M8 12c-2.5 0-4-1.5-4-1.5s1-2.5 3-2.5"/><path d="M16 12c2.5 0 4-1.5 4-1.5s-1-2.5-3-2.5"/><path d="M4 22h16"/></svg>,
  Lock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Copy: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
};

const playSound = (type) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  if (type === 'airhorn') {
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.5);
  }
};

const generateSecretKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let p1 = '', p2 = '';
    for (let i = 0; i < 5; i++) p1 += chars.charAt(Math.floor(Math.random() * chars.length));
    for (let i = 0; i < 4; i++) p2 += chars.charAt(Math.floor(Math.random() * chars.length));
    return `${p1}-${p2}`;
};

const backgroundImages = {
  banyan: 'https://images.unsplash.com/photo-1603512891963-44eb1c28c6e2?auto=format&fit=crop&q=80',
  classic: 'https://images.unsplash.com/photo-1593352216503-491176b6b772?auto=format&fit=crop&q=80',
  terracotta: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80'
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  
  // --- LOGIN & SECURITY STATES ---
  const [loginMode, setLoginMode] = useState('main'); 
  const [showSecurityPopup, setShowSecurityPopup] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [hasCopiedKey, setHasCopiedKey] = useState(false);
  const [keyCopiedText, setKeyCopiedText] = useState('Copy Key');
  const [pastKeyInput, setPastKeyInput] = useState('');
  
  const [userSecretKey, setUserSecretKey] = useState(null); // The master key for the user
  const [activeRoom, setActiveRoom] = useState(null);       // The secure private room ID

  // --- APP STATES ---
  const [activePage, setActivePage] = useState('chat'); 
  const [themeMode, setThemeMode] = useState('dark');
  const [bgTheme, setBgTheme] = useState('banyan');
  
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png');
  const [messageStats, setMessageStats] = useState({}); 

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [myId, setMyId] = useState('Generating Code...');
  const [friendId, setFriendId] = useState('');
  const [connected, setConnected] = useState(false);
  
  // --- MEDIA STATES ---
  const [mediaEnabled, setMediaEnabled] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [videoOverlay, setVideoOverlay] = useState(null);

  const peerInstance = useRef(null);
  const connectionRef = useRef(null);
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const myStreamRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000); 
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const triggerOverlay = (emoji) => {
    setVideoOverlay(emoji);
    setTimeout(() => setVideoOverlay(null), 2500); 
  };

  // --- LOGIN LOGIC ---
  const handleGoogleLogin = async () => {
    if (!auth || !googleProvider) return;
    try {
      const result = await auth.signInWithPopup(googleProvider);
      setUsername(result.user.displayName); 
      setAvatar(result.user.photoURL);
      // Google users get a permanent key based on their Google ID
      setUserSecretKey(result.user.uid.substring(0, 5).toUpperCase() + '-GOOG');
      setIsSetupComplete(true);
    } catch (error) { alert("Login failed."); }
  };

  const handleNewGuestContinue = () => {
    if(username) {
        setGeneratedKey(generateSecretKey());
        setShowSecurityPopup(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedKey).then(() => {
        setKeyCopiedText('Copied!');
        setTimeout(() => setKeyCopiedText('Copy Key'), 2000);
    });
  };

  const handleFinalGuestEntry = () => {
    if(hasCopiedKey) {
        setUserSecretKey(generatedKey);
        setShowSecurityPopup(false);
        setIsSetupComplete(true);
    }
  };

  const handlePastGuestLogin = () => {
    if(pastKeyInput.length > 5) {
        setUsername("Returning Villager"); 
        setUserSecretKey(pastKeyInput);
        setIsSetupComplete(true);
    } else {
        alert("Please enter a valid Secret Key");
    }
  };

  // --- PRIVATE ROOM DATABASE LOGIC ---
  useEffect(() => {
    if (!isSetupComplete || !db) return;

    if (!activeRoom) {
       // If not connected to anyone yet, show empty screen/welcome message
       setMessages([{ user: 'System', text: 'चौपाल में आपका स्वागत है! पुरानी पंचायत देखने या नई बात शुरू करने के लिए अपने दोस्त का Share Code डालकर JOIN करें।', type: 'text' }]);
       return;
    }

    // Now it only fetches from the PRIVATE ROOM, not the whole global database!
    const unsubscribe = db.collection('rooms').doc(activeRoom).collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot((snapshot) => {
        const dbMessages = snapshot.docs.map(doc => doc.data());
        setMessages(dbMessages);
      });
      
    return () => unsubscribe();
  }, [isSetupComplete, activeRoom]);

  // --- PERMANENT PEERJS CONNECTION ---
  useEffect(() => {
    if (!isSetupComplete || !window.Peer || !userSecretKey) return; 
    
    // Your Share Code is ALWAYS the first 5 letters of your Secret Key
    const permanentId = userSecretKey.split('-')[0];
    const peer = new window.Peer(permanentId); 
    
    peer.on('open', (id) => { setMyId(id); });
    
    peer.on('connection', (conn) => {
      connectionRef.current = conn; 
      setConnected(true);
      
      // When someone connects to you, create the Private Room ID (Sorted alphabetically)
      const roomName = [permanentId, conn.peer].sort().join('_');
      setActiveRoom(roomName);

      conn.on('data', (data) => {
        const incomingMessage = JSON.parse(data);
        if (incomingMessage.type === 'sound') { playSound(incomingMessage.soundType); triggerOverlay('📢'); }
      });
    });
    
    peer.on('call', (call) => {
      if (myStreamRef.current) {
        call.answer(myStreamRef.current);
        call.on('stream', (remoteStream) => { if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream; });
      } else {
        call.answer();
        call.on('stream', (remoteStream) => { if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream; });
      }
    });
    
    peerInstance.current = peer;
  }, [isSetupComplete, userSecretKey]);

  const connectToFriend = () => {
    if (!friendId || !userSecretKey) return;
    
    const permanentId = userSecretKey.split('-')[0];
    const conn = peerInstance.current.connect(friendId.toUpperCase());
    connectionRef.current = conn;
    
    conn.on('open', () => { 
        setConnected(true); 
        // When you connect to someone, set the Private Room ID
        const roomName = [permanentId, friendId.toUpperCase()].sort().join('_');
        setActiveRoom(roomName);
    });
    
    conn.on('data', (data) => {
      const incomingMessage = JSON.parse(data);
      if (incomingMessage.type === 'sound') { playSound(incomingMessage.soundType); triggerOverlay('📢'); } 
    });
  };

  const sendMessage = (text, type = 'text', fileData = null) => {
    if (!text && !fileData && type === 'text') return;
    if (!activeRoom) return; // Prevent sending if no room

    const myMessage = { user: username, text: text, avatar: avatar, type: type, file: fileData, timestamp: window.firebase.firestore.FieldValue.serverTimestamp() };
    
    // Save to PRIVATE ROOM
    if (db && activeRoom) { db.collection('rooms').doc(activeRoom).collection('messages').add(myMessage); }
    setInputText('');
  };

  const sendSound = (soundType) => {
    if (!activeRoom) return;
    playSound(soundType); triggerOverlay('📢');
    const soundData = { user: username, type: 'sound', soundType: soundType, text: `*Triggered sound*`, avatar: avatar };
    if (connectionRef.current && connected) connectionRef.current.send(JSON.stringify(soundData));
    if(db && activeRoom) db.collection('rooms').doc(activeRoom).collection('messages').add({...soundData, timestamp: window.firebase.firestore.FieldValue.serverTimestamp()});
  };

  // --- MEDIA ---
  const handleLaunchWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      myStreamRef.current = stream; setMediaEnabled(true); setIsScreenSharing(false); setIsCameraOn(true); setIsMicOn(true);
      if (myVideoRef.current) myVideoRef.current.srcObject = stream;
      if (connected && friendId && peerInstance.current) {
        const call = peerInstance.current.call(friendId.toUpperCase(), stream);
        call.on('stream', (remoteStream) => { if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream; });
      }
    } catch (err) { alert("Camera access denied."); }
  };

  const handleLaunchScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      myStreamRef.current = stream; setMediaEnabled(true); setIsScreenSharing(true);
      if (myVideoRef.current) myVideoRef.current.srcObject = stream;
      if (connected && friendId && peerInstance.current) { peerInstance.current.call(friendId.toUpperCase(), stream); }
      stream.getVideoTracks()[0].onended = () => { setMediaEnabled(false); setIsScreenSharing(false); };
    } catch (err) { console.error("Screen share cancelled."); }
  };

  const toggleMic = () => {
    if (myStreamRef.current && myStreamRef.current.getAudioTracks()[0]) {
      const track = myStreamRef.current.getAudioTracks()[0];
      track.enabled = !track.enabled;
      setIsMicOn(track.enabled);
    }
  };

  const toggleCamera = () => {
    if (myStreamRef.current && myStreamRef.current.getVideoTracks()[0]) {
      const track = myStreamRef.current.getVideoTracks()[0];
      track.enabled = !track.enabled;
      setIsCameraOn(track.enabled);
    }
  };

  const disableMedia = () => {
    if (myStreamRef.current) { myStreamRef.current.getTracks().forEach(track => track.stop()); }
    setMediaEnabled(false); if (myVideoRef.current) myVideoRef.current.srcObject = null;
  };

  const colors = { bg: themeMode === 'dark' ? '#2A201A' : '#F4ECE4', panel: themeMode === 'dark' ? '#3B2D24' : '#E8D8C8', border: themeMode === 'dark' ? '#5A4634' : '#C4A484', text: themeMode === 'dark' ? '#EAE0D5' : '#2A201A', accent: '#D4A373' };

  if (showSplash) {
    return (
      <div style={{ backgroundColor: '#2A201A', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '-8px' }}>
        <style>{`@keyframes logoReveal { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } } @keyframes textFade { 0% { opacity: 0; filter: blur(5px); } 100% { opacity: 1; filter: blur(0px); } }`}</style>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'logoReveal 1.5s ease-out forwards' }}>
          <Icon.TreeLogo />
          <h1 style={{ fontFamily: '"Yatra One", serif', color: '#D4A373', fontSize: '80px', margin: '10px 0 0 0', fontWeight: 'normal', animation: 'textFade 2s ease-in forwards', textShadow: '2px 4px 10px rgba(0,0,0,0.5)' }}>Setu</h1>
          <p style={{ color: '#EAE0D5', fontSize: '16px', letterSpacing: '4px', opacity: 0.7, marginTop: '5px' }}>THE VILLAGE SQUARE</p>
        </div>
      </div>
    );
  }

  if (!isSetupComplete) {
    return (
      <div style={{ fontFamily: '"Segoe UI", sans-serif', backgroundColor: '#2A201A', color: '#EAE0D5', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '-8px', backgroundImage: 'radial-gradient(circle, #3B2D24 0%, #2A201A 100%)' }}>
        
        {!showSecurityPopup && (
            <div style={{ backgroundColor: '#3B2D24', padding: '40px', borderRadius: '16px', textAlign: 'center', width: '400px', border: '1px solid #5A4634', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}><Icon.TreeLogo /></div>
            <h1 style={{ fontFamily: '"Yatra One", serif', marginTop: 0, color: '#D4A373', marginBottom: '5px', fontSize: '40px', fontWeight: 'normal' }}>Setu</h1>
            <p style={{ color: '#A68A6D', marginBottom: '30px', fontSize: '13px', letterSpacing: '1px' }}>ENTER THE CHAUPAL</p>
            
            {loginMode === 'main' && (
                <>
                <button onClick={handleGoogleLogin} style={{ width: '100%', padding: '12px', backgroundColor: '#EAE0D5', color: '#2A201A', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginBottom: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continue with Google
                </button>

                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#A68A6D' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#5A4634' }}></div>
                    <span style={{ padding: '0 15px', fontSize: '12px' }}>OR PLAY AS GUEST</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#5A4634' }}></div>
                </div>

                <button onClick={() => setLoginMode('new_guest')} style={{ width: '100%', padding: '15px', background: 'transparent', border: `2px solid #D4A373`, color: '#D4A373', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginBottom: '15px' }}>
                    Create New Guest Profile
                </button>

                <button onClick={() => setLoginMode('past_guest')} style={{ width: '100%', padding: '15px', background: '#2A201A', color: '#A68A6D', border: `1px solid #5A4634`, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <Icon.Lock /> Login with Secret Key
                </button>
                </>
            )}

            {loginMode === 'new_guest' && (
                <>
                <p style={{ color: '#D4A373', fontWeight: 'bold' }}>Create Anonymous Profile</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '25px', position: 'relative' }}>
                    <img src={avatar} alt="Avatar" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4A373' }} />
                    <label style={{ position: 'absolute', bottom: '-5px', backgroundColor: '#D4A373', color: '#2A201A', padding: '6px', borderRadius: '50%', cursor: 'pointer', border: '2px solid #3B2D24' }}>
                    <Icon.Camera />
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setAvatar)} style={{ display: 'none' }} />
                    </label>
                </div>
                <input type="text" placeholder="Enter Nickname..." value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '90%', padding: '15px', marginBottom: '25px', borderRadius: '8px', border: '1px solid #5A4634', backgroundColor: '#2A201A', color: '#EAE0D5', fontSize: '16px', textAlign: 'center', outline: 'none' }} />
                
                <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={() => setLoginMode('main')} style={{ flex: 1, padding: '15px', background: 'transparent', color: '#A68A6D', border: '1px solid #5A4634', borderRadius: '8px', cursor: 'pointer' }}>Back</button>
                    <button onClick={handleNewGuestContinue} style={{ flex: 2, padding: '15px', background: username ? '#D4A373' : '#5A4634', color: username ? '#2A201A' : '#A68A6D', border: 'none', borderRadius: '8px', cursor: username ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}>Generate Secret Key</button>
                </div>
                </>
            )}

            {loginMode === 'past_guest' && (
                <>
                <p style={{ color: '#D4A373', fontWeight: 'bold' }}>Welcome Back, Villager</p>
                <p style={{ color: '#A68A6D', fontSize: '12px', marginBottom: '20px' }}>Enter your 10-character secret key to restore your chats.</p>
                <input type="text" placeholder="e.g. X9K2P-Y7M4" value={pastKeyInput} onChange={(e) => setPastKeyInput(e.target.value.toUpperCase())} maxLength={10} style={{ width: '90%', padding: '15px', marginBottom: '25px', borderRadius: '8px', border: '1px solid #5A4634', backgroundColor: '#2A201A', color: '#D4A373', fontSize: '18px', textAlign: 'center', outline: 'none', letterSpacing: '2px', fontWeight: 'bold' }} />
                
                <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={() => setLoginMode('main')} style={{ flex: 1, padding: '15px', background: 'transparent', color: '#A68A6D', border: '1px solid #5A4634', borderRadius: '8px', cursor: 'pointer' }}>Back</button>
                    <button onClick={handlePastGuestLogin} style={{ flex: 2, padding: '15px', background: pastKeyInput.length > 5 ? '#D4A373' : '#5A4634', color: pastKeyInput.length > 5 ? '#2A201A' : '#A68A6D', border: 'none', borderRadius: '8px', cursor: pastKeyInput.length > 5 ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}>Restore Chats</button>
                </div>
                </>
            )}
            </div>
        )}

        {showSecurityPopup && (
            <div style={{ backgroundColor: '#1A1410', padding: '40px', borderRadius: '16px', textAlign: 'center', width: '450px', border: '2px solid #ef4444', boxShadow: '0 20px 50px rgba(239, 68, 68, 0.2)' }}>
                <div style={{ color: '#ef4444', marginBottom: '15px' }}><Icon.Lock /></div>
                <h2 style={{ color: '#ef4444', marginTop: 0, fontSize: '24px' }}>Save Your Secret Key!</h2>
                <p style={{ color: '#A68A6D', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                    To keep your identity completely anonymous but allow you to return to your chats later, we have generated a unique master key for you. <strong>If you lose this key, you will never be able to access your chats again.</strong>
                </p>

                <div style={{ backgroundColor: '#2A201A', padding: '20px', borderRadius: '8px', border: '1px dashed #D4A373', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '28px', color: '#D4A373', letterSpacing: '4px', fontWeight: 'bold', fontFamily: 'monospace' }}>{generatedKey}</span>
                    <button onClick={copyToClipboard} style={{ marginTop: '15px', padding: '8px 16px', backgroundColor: '#3B2D24', color: '#D4A373', border: '1px solid #D4A373', borderRadius: '4px', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                        <Icon.Copy /> {keyCopiedText}
                    </button>
                </div>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', textAlign: 'left', marginBottom: '30px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={hasCopiedKey} onChange={(e) => setHasCopiedKey(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: '#D4A373', marginTop: '2px' }} />
                    <span style={{ color: '#EAE0D5', fontSize: '14px' }}>I confirm that I have safely copied or written down my Secret Login Key.</span>
                </label>

                <button onClick={handleFinalGuestEntry} disabled={!hasCopiedKey} style={{ width: '100%', padding: '15px', background: hasCopiedKey ? '#4caf50' : '#3B2D24', color: hasCopiedKey ? '#fff' : '#A68A6D', border: 'none', borderRadius: '8px', cursor: hasCopiedKey ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontSize: '16px', transition: 'all 0.3s' }}>
                    {hasCopiedKey ? "Enter the Chaupal" : "Please check the box above"}
                </button>
            </div>
        )}

      </div>
    );
  }

  return (
    <div style={{ fontFamily: '"Segoe UI", sans-serif', backgroundColor: colors.bg, color: colors.text, height: '100vh', display: 'flex', margin: '-8px', transition: 'background 0.3s' }}>
      
      <div style={{ width: '80px', backgroundColor: colors.panel, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', borderRight: `1px solid ${colors.border}` }}>
        <div style={{ marginBottom: '30px', color: colors.accent }}><Icon.TreeLogo /></div>
        <button onClick={() => setActivePage('chat')} style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: activePage === 'chat' ? colors.border : 'transparent', color: activePage === 'chat' ? colors.accent : '#A68A6D', border: 'none', cursor: 'pointer', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Icon.Chat /></button>
        <button onClick={() => setActivePage('leaderboard')} style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: activePage === 'leaderboard' ? colors.border : 'transparent', color: activePage === 'leaderboard' ? colors.accent : '#A68A6D', border: 'none', cursor: 'pointer', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Icon.Trophy /></button>
        <div style={{ flex: 1 }}></div>
        <button onClick={() => setActivePage('settings')} style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: activePage === 'settings' ? colors.border : 'transparent', color: activePage === 'settings' ? colors.accent : '#A68A6D', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Icon.Settings /></button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '15px 30px', backgroundColor: colors.panel, borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontFamily: '"Yatra One", serif', color: colors.accent, letterSpacing: '1px' }}>
            {activePage === 'chat' ? 'Chaupal' : activePage === 'settings' ? 'Settings' : 'Village Elders'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: colors.bg, padding: '8px 15px', borderRadius: '8px', border: `1px solid ${colors.border}` }}>
            <span style={{ fontSize: '14px', color: '#A68A6D' }}>Share Code: <strong style={{ color: colors.accent, letterSpacing: '2px', marginLeft: '5px' }}>{myId}</strong></span>
            {!connected ? (
              <div style={{ display: 'flex', gap: '5px' }}>
                <input value={friendId} onChange={(e) => setFriendId(e.target.value)} maxLength={5} placeholder="ENTER CODE" style={{ padding: '6px 12px', borderRadius: '4px', border: `1px solid ${colors.border}`, backgroundColor: colors.panel, color: colors.text, outline: 'none', textTransform: 'uppercase', width: '100px', textAlign: 'center', fontWeight: 'bold' }} />
                <button onClick={connectToFriend} style={{ padding: '6px 15px', backgroundColor: colors.accent, color: '#2A201A', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>JOIN</button>
              </div>
            ) : ( <span style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '14px' }}>🟢 LINKED</span> )}
          </div>
        </header>

        {activePage === 'settings' && (
          <div style={{ padding: '40px', flex: 1, overflowY: 'auto' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: colors.panel, borderRadius: '12px', padding: '30px', border: `1px solid ${colors.border}` }}>
              <h2 style={{ color: colors.accent, borderBottom: `1px solid ${colors.border}`, paddingBottom: '10px' }}>App Customization</h2>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
                <div>
                  <strong style={{ fontSize: '18px', display: 'block' }}>Theme Appearance</strong>
                  <span style={{ fontSize: '14px', color: '#A68A6D' }}>Switch between Dark Night and Day Light modes.</span>
                </div>
                <button onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')} style={{ padding: '10px 20px', backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {themeMode === 'dark' ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
                </button>
              </div>

              <div style={{ padding: '20px 0', borderTop: `1px solid ${colors.border}` }}>
                <strong style={{ fontSize: '18px', display: 'block', marginBottom: '5px' }}>Chaupal Background</strong>
                <span style={{ fontSize: '14px', color: '#A68A6D', display: 'block', marginBottom: '15px' }}>Choose the scenery for your village square.</span>
                
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={() => setBgTheme('banyan')} style={{ padding: '10px 15px', borderRadius: '8px', border: bgTheme === 'banyan' ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`, backgroundColor: bgTheme === 'banyan' ? 'rgba(212, 163, 115, 0.1)' : colors.bg, color: colors.text, cursor: 'pointer', fontWeight: bgTheme === 'banyan' ? 'bold' : 'normal' }}>
                    🌳 Old Banyan Tree
                  </button>
                  <button onClick={() => setBgTheme('classic')} style={{ padding: '10px 15px', borderRadius: '8px', border: bgTheme === 'classic' ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`, backgroundColor: bgTheme === 'classic' ? 'rgba(212, 163, 115, 0.1)' : colors.bg, color: colors.text, cursor: 'pointer', fontWeight: bgTheme === 'classic' ? 'bold' : 'normal' }}>
                    🛖 Village Square
                  </button>
                  <button onClick={() => setBgTheme('terracotta')} style={{ padding: '10px 15px', borderRadius: '8px', border: bgTheme === 'terracotta' ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`, backgroundColor: bgTheme === 'terracotta' ? 'rgba(212, 163, 115, 0.1)' : colors.bg, color: colors.text, cursor: 'pointer', fontWeight: bgTheme === 'terracotta' ? 'bold' : 'normal' }}>
                    🏺 Terracotta Hues
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === 'chat' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', gap: '15px', padding: '15px', backgroundColor: colors.bg, height: '220px', borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ flex: 1, backgroundColor: colors.panel, borderRadius: '12px', overflow: 'hidden', position: 'relative', border: `1px solid ${colors.border}` }}>
                <video ref={myVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isCameraOn ? 1 : 0 }} />
                {!mediaEnabled ? (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
                    <button onClick={handleLaunchWebcam} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}><Icon.Camera /> Webcam</button>
                    <button onClick={handleLaunchScreenShare} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', backgroundColor: colors.accent, color: '#2A201A', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}><Icon.Screen /> Stream</button>
                  </div>
                ) : (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }}>
                    <button onClick={toggleMic} style={{ width: '36px', height: '36px', borderRadius: '8px', background: isMicOn ? 'rgba(0,0,0,0.5)' : '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}>{isMicOn ? <Icon.Mic /> : <Icon.MicOff />}</button>
                    <button onClick={toggleCamera} style={{ width: '36px', height: '36px', borderRadius: '8px', background: isCameraOn ? 'rgba(0,0,0,0.5)' : '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}>{isCameraOn ? <Icon.Camera /> : <Icon.CameraOff />}</button>
                    <button onClick={disableMedia} style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div style={{width:'12px', height:'12px', backgroundColor:'#fff', borderRadius:'2px'}}></div></button>
                  </div>
                )}
              </div>

              <div style={{ flex: 1, backgroundColor: colors.panel, borderRadius: '12px', overflow: 'hidden', position: 'relative', border: `1px solid ${colors.border}` }}>
                <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {!connected && <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#A68A6D', fontSize: '14px' }}>AWAITING SIGNAL...</span>}
              </div>
            </div>
            
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', backgroundImage: `linear-gradient(rgba(42, 32, 26, 0.85), rgba(42, 32, 26, 0.95)), url("${backgroundImages[bgTheme]}")`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 0.5s ease-in-out' }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: msg.user === username ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: '15px', alignSelf: msg.user === 'System' ? 'center' : 'auto' }}>
                  {msg.user !== 'System' && msg.avatar && <img src={msg.avatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: msg.user === username ? `2px solid ${colors.accent}` : `2px solid ${colors.border}` }} />}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.user === username ? 'flex-end' : 'flex-start' }}>
                    {msg.user !== 'System' && <span style={{ fontSize: '12px', color: '#D4A373', marginBottom: '5px' }}>{msg.user}</span>}
                    <div style={{ backgroundColor: msg.user === username ? colors.accent : (msg.user === 'System' ? 'transparent' : colors.panel), color: msg.user === username ? '#2A201A' : colors.text, padding: '12px 18px', borderRadius: '12px', border: msg.user === 'System' ? '1px dashed #A68A6D' : `1px solid ${colors.border}`, maxWidth: '400px', fontStyle: (msg.type === 'sound' || msg.type === 'reaction') ? 'italic' : 'normal', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                      {msg.type !== 'image' && <div style={{ fontSize: '14px' }}>{msg.text}</div>}
                      {msg.type === 'image' && <img src={msg.file} alt="Shared" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '5px' }} />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '15px 20px', backgroundColor: colors.panel, display: 'flex', gap: '10px', alignItems: 'center', borderTop: `1px solid ${colors.border}` }}>
              <label style={{ cursor: activeRoom ? 'pointer' : 'not-allowed', opacity: activeRoom ? 1 : 0.5 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: colors.bg, color: colors.accent, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Icon.Image /></div>
                <input type="file" disabled={!activeRoom} accept="image/*" onChange={(e) => handleImageUpload(e, (data) => sendMessage('Sent an image', 'image', data))} style={{ display: 'none' }} />
              </label>

              <button onClick={() => sendSound('airhorn')} disabled={!activeRoom} style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: colors.bg, color: colors.accent, border: `1px solid ${colors.border}`, cursor: activeRoom ? 'pointer' : 'not-allowed', opacity: activeRoom ? 1 : 0.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Icon.Megaphone /></button>

              <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText)} disabled={!activeRoom} placeholder={activeRoom ? "Speak to the Chaupal..." : "Link required to send..."} style={{ flex: 1, padding: '12px 15px', borderRadius: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, outline: 'none', fontSize: '14px' }} />
              
              <button onClick={() => sendMessage(inputText)} disabled={!activeRoom} style={{ padding: '0 20px', height: '42px', backgroundColor: activeRoom ? colors.accent : colors.bg, color: activeRoom ? '#2A201A' : '#A68A6D', border: 'none', borderRadius: '8px', cursor: activeRoom ? 'pointer' : 'not-allowed', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Icon.Send /></button>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}