import { useState } from "react";

export const useReport = () => {
  const [isReportModal, setIsReportModal] = useState(false);

  const [report, setReport] = useState("");

  const onPressCancel = () => {
    setIsReportModal(false);
  };

  const onPressConfirm = () => {
    if (report.length === 0) return;
    fetch("/api/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        report: report,
      }),
    })
      .then((res) => {
        alert("소중한 의견 감사합니다~~");
        setReport("");
      })
      .catch((err) => {
        console.log(err);
      });

    setIsReportModal(false);
  };

  const onPressReport = () => {
    setIsReportModal(true);
  };

  const onChangeReport = (e) => {
    setReport(e.target.value);
  };

  return {
    onPressReport,
    onPressCancel,
    onPressConfirm,
    report,
    onChangeReport,
    isReportModal,
  };
};
