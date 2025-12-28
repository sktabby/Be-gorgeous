import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../app/routes";
import { setAdminAuthed } from "../../store/admin.session";
import { adminSignIn } from "../../app/firebase/auth";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  async function login() {
    setErr("");
    try {
      await adminSignIn(email, pass);
      setAdminAuthed(true);
      nav(ROUTES.ADMIN_DASH);
    } catch (e) {
      setErr("Login failed. Check email & password.");
    }
  }

  return (
    <div className="authWrap">
      <div className="authCard">
        <div className="authTitle">Admin Login</div>
        <div className="muted" style={{ marginTop: 6 }}>Manage categories and products.</div>

        <div className="form">
          <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={pass} onChange={(e)=>setPass(e.target.value)} />
          {err && <div className="err">{err}</div>}
          <button className="btn primary" onClick={login}>Login</button>
          <button className="btn ghost" onClick={() => nav("/")}>Back to store</button>
        </div>
      </div>
    </div>
  );
}
