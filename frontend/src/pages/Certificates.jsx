import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Download, Eye, X, ShieldCheck, Calendar, Bookmark, Star, Zap, Droplet, TreePine, Wind } from 'lucide-react';

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCert, setActiveCert] = useState(null); // Selected certificate for modal preview
  const [downloading, setDownloading] = useState(false);

  const certCanvasRef = useRef(null);

  const getBadgeIcon = (badgeName) => {
    switch (badgeName) {
      case "Eco Beginner": return <Award size={32} color="#7FB77E" />;
      case "Climate Hero": return <ShieldCheck size={32} color="#8B6B4A" />;
      case "Water Saver": return <Droplet size={32} color="#C3AED6" />;
      case "Green Learner": return <Award size={32} color="#A67C52" fill="#A67C52" />;
      case "Quiz Master": return <Star size={32} color="#F5D061" fill="#F5D061" />;
      case "Clean Energy Spark": return <Zap size={32} color="#F5D061" fill="#F5D061" />;
      case "Forest Guardian": return <TreePine size={32} color="#7FB77E" fill="#7FB77E" />;
      case "Clean Air Cadet": return <Wind size={32} color="#7FB77E" />;
      default: return <Award size={32} color="#7FB77E" />;
    }
  };

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await axios.get('/api/certificates');
        setCerts(res.data);
      } catch (err) {
        console.error("Failed to load user certificates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleDownload = async () => {
    if (!certCanvasRef.current) return;
    setDownloading(true);

    try {
      // Dynamically import libraries to improve page load speed
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = certCanvasRef.current;
      // Capture canvas as high-res image
      const canvas = await html2canvas(element, {
        scale: 2, // 2x resolution
        useCORS: true,
        backgroundColor: '#FFFFFF',
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Setup PDF document: landscape layout (A4 size: 297mm x 210mm)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
      pdf.save(`ecoversee-certificate-${activeCert.certificateId}.pdf`);
    } catch (e) {
      console.error("PDF generation failed", e);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="btn btn-ghost">Loading Certificates...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <h1 style={styles.title}>Certificate Center</h1>
        <p style={styles.subtitle}>View, verify, and export your dynamically generated course completion certificates as PDFs.</p>
      </div>

      {/* Grid of Certificates */}
      <div style={styles.grid}>
        {certs.length > 0 ? (
          certs.map((cert, idx) => (
            <motion.div
              key={cert.certificateId}
              style={styles.card}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 10px 25px rgba(139, 107, 74, 0.1)" }}
            >
              <div style={styles.cardHeader}>
                <Award size={36} color="#8B6B4A" />
                <div style={styles.cardMeta}>
                  <span style={styles.certId}>ID: {cert.certificateId}</span>
                  <h3 style={styles.courseName}>{cert.courseName}</h3>
                </div>
              </div>
              
              <div style={styles.cardFooter}>
                <div style={styles.dateCol}>
                  <Calendar size={14} color="#A39387" />
                  <span>Issued {cert.issueDate}</span>
                </div>
                <button
                  onClick={() => setActiveCert(cert)}
                  className="btn btn-primary"
                  style={styles.previewBtn}
                >
                  <Eye size={16} />
                  <span>Preview</span>
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <Award size={48} color="#A39387" style={{ marginBottom: '12px' }} />
            <p>You have not earned any certificates yet. Complete a course and score 60%+ on the quiz to unlock your certificate!</p>
          </div>
        )}
      </div>

      {/* Preview Modal Overlay */}
      <AnimatePresence>
        {activeCert && (
          <div style={styles.modalOverlay}>
            <motion.div
              style={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              {/* Modal Top Bar */}
              <div style={styles.modalTopBar}>
                <h3>Certificate Preview</h3>
                <div style={styles.modalActions}>
                  <button
                    onClick={handleDownload}
                    className="btn btn-secondary"
                    style={styles.downloadBtn}
                    disabled={downloading}
                  >
                    <Download size={16} />
                    <span>{downloading ? 'Exporting...' : 'Download PDF'}</span>
                  </button>
                  <button onClick={() => setActiveCert(null)} style={styles.closeBtn}>
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Certificate Canvas Area (To capture as image) */}
              <div style={styles.canvasContainer}>
                <div ref={certCanvasRef} style={styles.certificateCanvas}>
                  {/* Eco border frame */}
                  <div style={styles.innerBorder}>
                    {/* Gold corner ornaments */}
                    <div style={styles.cornerTL} />
                    <div style={styles.cornerTR} />
                    <div style={styles.cornerBL} />
                    <div style={styles.cornerBR} />
                    
                    {/* Leaf background vectors (simulated using CSS gradients) */}
                    <div style={styles.leafWatermarkL} />
                    <div style={styles.leafWatermarkR} />

                    <div style={styles.certBody}>
                      {/* Custom Ecoversee Logo Header */}
                      <div style={styles.logoRow}>
                        <img src="/logo.png" alt="EcoVerse Logo" style={{ height: '55px', objectFit: 'contain' }} />
                      </div>
                      
                      <span style={styles.certTag}>Certificate of Completion</span>
                      <p style={styles.presentedText}>This certifies that</p>
                      <h2 style={styles.studentName}>{activeCert.fullName}</h2>
                      
                      <p style={styles.certDesc}>
                        has successfully completed all required modules, lesson elements, and evaluated assessments for the course:
                      </p>
                      <h3 style={styles.completedCourseTitle}>{activeCert.courseName}</h3>

                      {/* Verified Badge seal, Ecoverse seal, and Signature */}
                      <div style={styles.sealRow}>
                        {/* Course Badge */}
                        <div style={styles.sealBlock}>
                          <div style={styles.badgeCircle}>
                            {getBadgeIcon(activeCert.badgeName)}
                          </div>
                          <div style={styles.sealText}>
                            <span style={styles.sealHeading}>COURSE BADGE</span>
                            <span style={styles.sealSub}>{activeCert.badgeName || 'Eco Citizen'}</span>
                          </div>
                        </div>

                        {/* Premium Ecoverse Gold Seal */}
                        <div style={styles.premiumSeal}>
                          <svg width="64" height="64" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
                            <path d="M35 60 L20 95 L45 80 L50 60 Z" fill="#C59B27" />
                            <path d="M65 60 L80 95 L55 80 L50 60 Z" fill="#D4AC0D" />
                            <circle cx="50" cy="50" r="34" fill="#D4AC0D" stroke="#C59B27" strokeWidth="2" />
                            <circle cx="50" cy="50" r="28" fill="#1B4D2C" />
                            <circle cx="50" cy="50" r="23" fill="none" stroke="#D4AC0D" strokeWidth="1" strokeDasharray="3 3" />
                            <text x="50" y="44" fill="#D4AC0D" fontSize="6.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">ECOVERSE</text>
                            <text x="50" y="53" fill="#FFFFFF" fontSize="6" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">OFFICIAL</text>
                            <text x="50" y="62" fill="#D4AC0D" fontSize="4.5" fontWeight="bold" textAnchor="middle">★ SEAL ★</text>
                          </svg>
                        </div>
                        
                        {/* Authorized Board Signature */}
                        <div style={styles.signatureBlock}>
                          <div style={styles.sigContainer}>
                            <img src="/signature.png" alt="Authorized Signature" style={{ height: '40px', objectFit: 'contain' }} />
                          </div>
                          <span style={styles.sigLabel}>AUTHORIZED SIGNATURE</span>
                        </div>
                      </div>

                      {/* Certificate details */}
                      <div style={styles.certFooterDetails}>
                        <span>Issue Date: <strong>{activeCert.issueDate}</strong></span>
                        <span>Verification ID: <strong>{activeCert.certificateId}</strong></span>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: '40px',
  },
  loading: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#8B6B4A',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6E5C50',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(139, 107, 74, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '160px',
  },
  cardHeader: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  cardMeta: {
    display: 'flex',
    flexDirection: 'column',
  },
  certId: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#A39387',
  },
  courseName: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#2D241E',
    marginTop: '2px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: '#6E5C50',
    fontWeight: '600',
  },
  previewBtn: {
    padding: '8px 16px',
    fontSize: '0.82rem',
  },
  emptyState: {
    gridColumn: '1 / -1',
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADBCE',
    borderRadius: '20px',
    padding: '60px 40px',
    textAlign: 'center',
    color: '#6E5C50',
    maxWidth: '480px',
    margin: '0 auto',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(45, 36, 30, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #EADBCE',
    width: '100%',
    maxWidth: '860px',
    overflow: 'hidden',
    boxShadow: '0 24px 60px rgba(45, 36, 30, 0.25)',
  },
  modalTopBar: {
    height: '64px',
    borderBottom: '1px solid #F8F5F1',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  modalActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  downloadBtn: {
    padding: '8px 16px',
    fontSize: '0.85rem',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#A39387',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#F8F5F1',
      color: '#2D241E',
    }
  },
  canvasContainer: {
    padding: '24px',
    backgroundColor: '#F8F5F1',
    overflowX: 'auto',
    display: 'flex',
    justifyContent: 'center',
  },
  certificateCanvas: {
    width: '740px', // Matches landscape proportions (A4 size capture ratio)
    height: '520px',
    background: 'radial-gradient(circle, #FCFAF5 35%, #E6EFE4 100%)',
    backgroundImage: 'radial-gradient(circle, #FCFAF5 35%, #E6EFE4 100%), url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54 48c-2 0-3 1-4 2v4c0 1-1 2-2 2H4c-1 0-2-1-2-2V12c0-2 1-3 2-4h4c1 0 2-1 2-2s1-2 2-2h32c1 0 2 1 2 2v4c0 1 1 2 2 2h4c2 0 3 1 4 2v32zm-2 0h-4c-1 0-2-1-2-2V12c0-1-1-2-2-2h-4c-1 0-2-1-2-2s-1-2-2-2H14c-1 0-2 1-2 2v4c0 1-1 2-2 2H4v36h40c1 0 2 1 2 2v4c0 1 1 2 2 2h4V48z\' fill=\'%23d4ac0d\' fill-opacity=\'.015\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    padding: '16px',
    position: 'relative',
    flexShrink: 0,
    boxShadow: '0 10px 30px rgba(45, 36, 30, 0.15)',
  },
  innerBorder: {
    border: '2px solid #1B4D2C',
    outline: '4px double #D4AC0D',
    outlineOffset: '-12px',
    height: '100%',
    padding: '24px 30px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cornerTL: {
    position: 'absolute',
    top: '18px',
    left: '18px',
    width: '24px',
    height: '24px',
    borderTop: '3px solid #D4AC0D',
    borderLeft: '3px solid #D4AC0D',
    pointerEvents: 'none',
  },
  cornerTR: {
    position: 'absolute',
    top: '18px',
    right: '18px',
    width: '24px',
    height: '24px',
    borderTop: '3px solid #D4AC0D',
    borderRight: '3px solid #D4AC0D',
    pointerEvents: 'none',
  },
  cornerBL: {
    position: 'absolute',
    bottom: '18px',
    left: '18px',
    width: '24px',
    height: '24px',
    borderBottom: '3px solid #D4AC0D',
    borderLeft: '3px solid #D4AC0D',
    pointerEvents: 'none',
  },
  cornerBR: {
    position: 'absolute',
    bottom: '18px',
    right: '18px',
    width: '24px',
    height: '24px',
    borderBottom: '3px solid #D4AC0D',
    borderRight: '3px solid #D4AC0D',
    pointerEvents: 'none',
  },
  leafWatermarkL: {
    position: 'absolute',
    bottom: '40px',
    left: '40px',
    width: '180px',
    height: '180px',
    background: 'radial-gradient(circle, rgba(127,183,126,0.04) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  leafWatermarkR: {
    position: 'absolute',
    top: '40px',
    right: '40px',
    width: '180px',
    height: '180px',
    background: 'radial-gradient(circle, rgba(127,183,126,0.04) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  certBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  certTag: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#D4AC0D',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    margin: '8px 0',
  },
  certTitle: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: '#7FB77E',
    letterSpacing: '1px',
  },
  subCertTitle: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: '#A39387',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '20px',
  },
  presentedText: {
    fontSize: '0.9rem',
    fontStyle: 'italic',
    color: '#6E5C50',
    margin: '4px 0',
  },
  studentName: {
    fontSize: '2.4rem',
    fontWeight: '800',
    color: '#1B4D2C',
    borderBottom: '2px solid #D4AC0D',
    paddingBottom: '4px',
    minWidth: '320px',
    textAlign: 'center',
    margin: '6px 0',
    fontFamily: 'Georgia, serif',
  },
  certDesc: {
    fontSize: '0.82rem',
    color: '#6E5C50',
    textAlign: 'center',
    maxWidth: '520px',
    lineHeight: '1.45',
    margin: '6px 0',
  },
  completedCourseTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#8B6B4A',
    margin: '4px 0 16px 0',
    textAlign: 'center',
  },
  sealRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0 20px',
    alignItems: 'center',
    marginTop: '10px',
  },
  sealBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '200px',
    textAlign: 'left',
  },
  sealText: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  sealHeading: {
    fontSize: '0.7rem',
    fontWeight: '800',
    color: '#1B4D2C',
  },
  sealSub: {
    fontSize: '0.62rem',
    color: '#8B6B4A',
    fontWeight: '700',
    marginTop: '2px',
  },
  premiumSeal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '200px',
  },
  sigContainer: {
    borderBottom: '1px solid #1B4D2C',
    paddingBottom: '4px',
    width: '130px',
    height: '42px',
    display: 'flex',
    justifyContent: 'center',
  },
  sigLabel: {
    fontSize: '0.62rem',
    color: '#8B6B4A',
    fontWeight: '800',
    marginTop: '6px',
    letterSpacing: '1px',
  },
  certFooterDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    borderTop: '1px solid rgba(27, 77, 44, 0.1)',
    paddingTop: '8px',
    fontSize: '0.7rem',
    color: '#A39387',
    marginTop: '8px',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '4px 0',
  },
  logoTextCol: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  logoBrand: {
    fontSize: '1.25rem',
    fontWeight: '900',
    color: '#1B4D2C',
    letterSpacing: '2px',
    margin: 0,
    lineHeight: 1.1,
  },
  logoSub: {
    fontSize: '0.58rem',
    fontWeight: '800',
    color: '#D4AC0D',
    letterSpacing: '1.5px',
  },
  badgeCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    border: '2px solid #D4AC0D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
};
