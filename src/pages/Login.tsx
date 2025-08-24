import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/hooks/use-i18n";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = isLogin ? "http://127.0.0.1:5000/login" : "http://127.0.0.1:5000/signup";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setError(data.error || t('auth.unknownError'));
      } else if (isLogin) {
        // Store tokens if needed
        supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token
        });
        navigate("/", { replace: true });
      } else {
        alert(t('auth.signupSuccess'));
        setIsLogin(true);
      }
    } catch (err) {
      setError((err as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-40 p-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
              {t('auth.projectName')}
            </h1>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
      <form onSubmit={handleAuth} className="bg-background p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center mb-2">{isLogin ? t('auth.login') : t('auth.signup')}</h1>
        {error && <div className="text-red-600 text-center">{error}</div>}
        <Input
          type="email"
          placeholder={t('auth.email')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder={t('auth.password')}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (isLogin ? t('auth.loggingIn') : t('auth.signingUp')) : (isLogin ? t('auth.loginButton') : t('auth.signupButton'))}
        </Button>
        <div className="text-center">
          <button
            type="button"
            className="text-primary underline"
            onClick={() => setIsLogin(l => !l)}
          >
            {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
          </button>
        </div>
      </form>
    </div>
  );
}
