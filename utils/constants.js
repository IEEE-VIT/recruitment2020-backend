module.exports = {
  Tech: "Tech",
  Mgmt: "Management",
  Unknown: "Unknown",
  Dsn: "Design",
  AcceptedReview: "AR",
  RejectedReview: "RR",
  ExceptionReview: "ER",
  PendingReview: "PR",
  NoSlot: "NS",
  Ready: "RD",
  Missed: "MS",
  Locked: "LD",
  Deadline: "DD",
  ReviewTypes() {
    return [
      this.AcceptedReview,
      this.RejectedReview,
      this.ExceptionReview,
      this.PendingReview,
    ];
  },
  App: "App",
  Web: "Web",
  Ml: "ML",
  Elec: "Electronics",
  CSec: "CyberSecurity",
  ARVR: "AR/VR",
  TechDomains() {
    return [this.App, this.Web, this.Ml, this.Elec, this.CSec, this.ARVR];
  },
  GDes: "GraphicDesign",
  Ui: "UI/UX",
  Vfx: "VFX",
  ThreeD: "  3D",
  DesignDomains() {
    return [this.GDes, this.Ui, this.Vfx, this.ThreeD];
  },
  MgmtDomains() {
    return [this.Mgmt];
  },
  NonMandatoryQuesions: 2,
  round1MaxCandidatesPerSlot: 5,
  round2MaxCandidatesPerMgmtSlot: 15,
  showSlotsafterHours: 2,
};
