
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Learning from "./pages/Learning";
import Levels from "./pages/Levels";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Import all course components
import WebSecurity from "./pages/Learning/courses/WebSecurity";
import NetworkPentesting from "./pages/Learning/courses/NetworkPentesting";
import ReverseEngineering from "./pages/Learning/courses/ReverseEngineering";
import Cryptography from "./pages/Learning/courses/Cryptography";
import CTFWalkthroughs from "./pages/Learning/courses/CTFWalkthroughs";
import LinuxEthicalHacking from "./pages/Learning/courses/LinuxEthicalHacking";
import SocialEngineering from "./pages/Learning/courses/SocialEngineering";
import WirelessSecurity from "./pages/Learning/courses/WirelessSecurity";
import DigitalForensics from "./pages/Learning/courses/DigitalForensics";
import APTThreats from "./pages/Learning/courses/APTThreats";
import SecureCoding from "./pages/Learning/courses/SecureCoding";
import IncidentResponse from "./pages/Learning/courses/IncidentResponse";
import FirewallGame from "./pages/levels/FirewallGame";
import PhishersTrap from "./pages/levels/PhishersTrap";
import PasswordVault from "./pages/levels/PasswordVault";
import EncryptedZone from "./pages/levels/EncryptedZone";
import PortScanner from "./pages/levels/PortScanner";
import SQLVaultBreach from "./pages/levels/SQLVaultBreach";

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl animate-bounce"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/learning" element={<Learning />} />
                  <Route path="/levels" element={<Levels />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  <Route path="/level1" element={<FirewallGame/>}/>
                  <Route path="/level2" element={<PhishersTrap/>}/>
                  <Route path="/level3" element={<PasswordVault/>}/>
                  <Route path="/level4" element={<EncryptedZone/>}/>
                  <Route path="/level5" element={<PortScanner/>}/>
                  <Route path="/level6" element={<SQLVaultBreach/>}/>
                  {/* Learning Course Routes */}
                  <Route path="/learning/web-security" element={<WebSecurity />} />
                  <Route path="/learning/network-pentesting" element={<NetworkPentesting />} />
                  <Route path="/learning/reverse-engineering" element={<ReverseEngineering />} />
                  <Route path="/learning/cryptography" element={<Cryptography />} />
                  <Route path="/learning/ctf-walkthroughs" element={<CTFWalkthroughs />} />
                  <Route path="/learning/linux-ethical-hacking" element={<LinuxEthicalHacking />} />
                  <Route path="/learning/social-engineering" element={<SocialEngineering />} />
                  <Route path="/learning/wireless-security" element={<WirelessSecurity />} />
                  <Route path="/learning/digital-forensics" element={<DigitalForensics />} />
                  <Route path="/learning/apt-threats" element={<APTThreats />} />
                  <Route path="/learning/secure-coding" element={<SecureCoding />} />
                  <Route path="/learning/incident-response" element={<IncidentResponse />} />
                  <Route path="/levels/FirewallGame.jsx" element={<FirewallGame/>}/>
                  <Route path="/levels/PhishersTrap.jsx" element={<PhishersTrap/>}/>
                  <Route path="/levels/PasswordVault.jsx" element={<PasswordVault/>}/>
                  <Route path="/levels/EncryptedZone.jsx" element={<EncryptedZone/>}/>
                  <Route path="/levels/PortScanner.jsx" element={<PortScanner/>}/>
                  <Route path="/levels/SQLVaultBreach.jsx" element={<SQLVaultBreach/>}/>
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </Router>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;