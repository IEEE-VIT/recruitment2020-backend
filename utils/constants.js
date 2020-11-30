module.exports = {
  Tech: "Tech",
  Mgmt: "Management",
  Unknown: "Unknown",
  Dsn: "Design",
  AcceptedReview: "AR",
  RejectedReview: "RR",
  ExceptionReview: "ER",
  PendingReview: "PR",
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
  Game: "GameDev",
  TechDomains() {
    return [this.App, this.Web, this.Ml, this.Elec, this.CSec, this.Game];
  },
  GDes: "GraphicDesign",
  Ui: "UI/UX",
  Vfx: "VFX",
  DesignDomains() {
    return [this.GDes, this.Ui, this.Vfx];
  },
  MgmtDomains() {
    return [this.Mgmt];
  },
  NonMandatoryQuesions: 2,
  round1MaxCandidatesPerSlot: 5,
  round2MaxCandidatesPerMgmtSlot: 15,
};
