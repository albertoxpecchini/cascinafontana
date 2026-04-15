"use client";

import { useCallback, useRef, useState } from "react";
import styles from "./landing-page.module.css";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const data = {
      nome: fd.get("nome"),
      email: fd.get("email"),
      messaggio: fd.get("messaggio"),
    };

    try {
      const res = await fetch("/api/contatti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(json.error ?? "Errore durante l'invio.");
        return;
      }
      setStatus("sent");
      formRef.current?.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Errore di rete. Riprova più tardi.");
    }
  }, []);

  return (
    <form ref={formRef} className={styles.contactForm} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>Nome</span>
        <input className={styles.input} type="text" name="nome" placeholder="Nome e cognome" required maxLength={120} disabled={status === "sending"} />
      </label>

      <label className={styles.field}>
        <span>Email</span>
        <input className={styles.input} type="email" name="email" placeholder="email@esempio.it" required maxLength={254} disabled={status === "sending"} />
      </label>

      <label className={styles.field}>
        <span>Messaggio</span>
        <textarea className={styles.textarea} name="messaggio" rows={4} placeholder="Raccontaci la tua richiesta." required maxLength={2000} disabled={status === "sending"} />
      </label>

      <button type="submit" className={styles.primaryButton} disabled={status === "sending"}>
        {status === "sending" ? "Invio in corso…" : "Invia richiesta"}
      </button>

      {status === "sent" && <p className={styles.formSuccess}>Richiesta inviata. Ti risponderemo al più presto.</p>}
      {status === "error" && <p className={styles.formError}>{errorMsg}</p>}
    </form>
  );
}
