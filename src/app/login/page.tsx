"use client";

import React, { useState } from "react";
import { useAuth } from "@/store/AuthStore";
import { User, Lock, Mail, Phone, Flag, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const { login, register } = useAuth();

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Recovery State
  const { requestPasswordReset } = useAuth();
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryStatus, setRecoveryStatus] = useState({ type: "", message: "" });
  const [isRecovering, setIsRecovering] = useState(false);

  // Register State
  const [regData, setRegData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [regError, setRegError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const success = await login(loginEmail, loginPassword, rememberMe);
      if (!success) {
        setLoginError("E-mail ou senha incorretos.");
      }
    } catch (err) {
      setLoginError("Ocorreu um erro ao tentar fazer login.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (regData.password !== regData.confirmPassword) {
      setRegError("As senhas não coincidem.");
      return;
    }
    
    if (!acceptTerms) {
      setRegError("Você deve aceitar os termos de contrato.");
      return;
    }

    setIsRegistering(true);

    try {
      await register({
        name: regData.name,
        role: regData.role,
        email: regData.email,
        phone: regData.phone,
        password: regData.password,
        campaign: "Minha Campanha 2026"
      });
      // automatically redirects after register from layout logic
    } catch (err: any) {
      setRegError(err.message || "Ocorreu um erro ao cadastrar.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegData({ ...regData, [e.target.name]: e.target.value });
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryStatus({ type: "", message: "" });
    setIsRecovering(true);

    try {
      await requestPasswordReset(recoveryEmail);
      setRecoveryStatus({ type: "success", message: "Enviamos as instruções de redefinição para o seu e-mail." });
    } catch (err: any) {
      setRecoveryStatus({ type: "error", message: err.message || "Ocorreu um erro ao solicitar redefinição." });
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 font-sans">
      {/* Left Column - Login */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-overlay py-12 lg:py-0">
        <div className="mx-auto w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 relative">
          
          <div className="text-center">
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
              {showRecovery ? "Recuperar Senha" : "Acesse sua Conta"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {showRecovery ? "Informe seu e-mail para receber as instruções." : "Painel Estratégico - Inteligência Geopolítica SC 2026"}
            </p>
          </div>
          
          {showRecovery ? (
            <form className="mt-8 space-y-6" onSubmit={handleRecoverySubmit}>
              {recoveryStatus.message && (
                <div className={`p-4 rounded-lg text-sm flex items-start gap-3 ${recoveryStatus.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                  {recoveryStatus.type === 'error' ? (
                    <ShieldCheck size={20} className="mt-0.5 flex-shrink-0" />
                  ) : (
                    <ShieldCheck size={20} className="mt-0.5 flex-shrink-0" />
                  )}
                  <span>{recoveryStatus.message}</span>
                </div>
              )}
              
              {!recoveryStatus.message || recoveryStatus.type === 'error' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Cadastrado</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        name="recoveryEmail"
                        type="email"
                        required
                        className="pl-10 block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-podemos-green focus:border-podemos-green sm:text-sm transition-all"
                        placeholder="voce@email.com"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isRecovering}
                      className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white ${
                        isRecovering ? "bg-podemos-green/70 cursor-not-allowed" : "bg-podemos-green hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-podemos-green transition-all`}
                    >
                      {isRecovering ? "Enviando..." : "Enviar Instruções"}
                    </button>
                  </div>
                </>
              ) : null}

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRecovery(false);
                    setRecoveryStatus({ type: "", message: "" });
                  }}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Voltar para o Login
                </button>
              </div>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <ShieldCheck size={18} className="mt-0.5 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      required
                      className="pl-10 block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-podemos-green focus:border-podemos-green sm:text-sm transition-all"
                      placeholder="E-mail"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      name="password"
                      type="password"
                      required
                      className="pl-10 block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-podemos-green focus:border-podemos-green sm:text-sm transition-all"
                      placeholder="Senha"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-podemos-green focus:ring-podemos-green border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer select-none">
                    Mantenha-me conectado
                  </label>
                </div>

                <div className="text-sm">
                  <button type="button" onClick={() => setShowRecovery(true)} className="font-medium text-podemos-blue hover:text-blue-800 transition-colors">
                    Esqueceu a senha?
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white ${
                    isLoggingIn ? "bg-podemos-green/70 cursor-not-allowed" : "bg-podemos-green hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-podemos-green transition-all`}
                >
                  {isLoggingIn ? "Autenticando..." : "Entrar na Plataforma"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Column - Registration */}
      <div className="w-full lg:w-[480px] xl:w-[500px] bg-white border-l border-gray-200 overflow-y-auto flex flex-col justify-center">
        <div className="p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Novo Cadastro</h2>
            <p className="text-sm text-gray-500 mt-1">
              Crie sua conta para acessar a plataforma de inteligência.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleRegisterSubmit}>
            {regError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {regError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={regData.name}
                  onChange={handleRegChange}
                  className="pl-9 block w-full px-3 py-2.5 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-podemos-blue focus:border-podemos-blue sm:text-sm transition-all"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Pretendido</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Flag size={16} className="text-gray-400" />
                </div>
                <select
                  name="role"
                  required
                  value={regData.role}
                  onChange={handleRegChange}
                  className="pl-9 block w-full px-3 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-podemos-blue focus:border-podemos-blue sm:text-sm transition-all appearance-none"
                >
                  <option value="" disabled>Selecione um cargo...</option>
                  <option value="Governador">Governador</option>
                  <option value="Vice-Governador">Vice-Governador</option>
                  <option value="Senador">Senador</option>
                  <option value="Deputado Federal">Deputado Federal</option>
                  <option value="Deputado Estadual">Deputado Estadual</option>
                  <option value="Prefeito">Prefeito</option>
                  <option value="Vice-Prefeito">Vice-Prefeito</option>
                  <option value="Vereador">Vereador</option>
                  <option value="Coordenador de Campanha">Coordenador de Campanha</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={regData.email}
                  onChange={handleRegChange}
                  className="pl-9 block w-full px-3 py-2.5 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-podemos-blue focus:border-podemos-blue sm:text-sm transition-all"
                  placeholder="voce@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Celular / WhatsApp</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={16} className="text-gray-400" />
                </div>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={regData.phone}
                  onChange={handleRegChange}
                  className="pl-9 block w-full px-3 py-2.5 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-podemos-blue focus:border-podemos-blue sm:text-sm transition-all"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={regData.password}
                  onChange={handleRegChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-podemos-blue focus:border-podemos-blue sm:text-sm transition-all"
                  placeholder="Senha"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={regData.confirmPassword}
                  onChange={handleRegChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-podemos-blue focus:border-podemos-blue sm:text-sm transition-all"
                  placeholder="Repita a senha"
                />
              </div>
            </div>

            <div className="flex items-start mt-2">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-podemos-blue/30 text-podemos-blue cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-light text-gray-500 cursor-pointer select-none">
                   Eu aceito os <a href="#" className="font-medium text-podemos-blue hover:underline">Termos de Contrato</a> e a <a href="#" className="font-medium text-podemos-blue hover:underline">Política de Privacidade</a>.
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isRegistering}
                className={`w-full text-white bg-podemos-blue hover:bg-blue-800 hover:-translate-y-0.5 hover:shadow-lg focus:ring-4 focus:outline-none focus:ring-podemos-blue/30 font-bold rounded-lg text-sm px-5 py-3 text-center transition-all ${
                  isRegistering ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isRegistering ? "Criando conta..." : "Criar Conta Gratuita"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
