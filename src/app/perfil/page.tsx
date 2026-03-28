"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/store/AuthStore";
import { User, Mail, Briefcase, Flag, Save, CheckCircle, Shield, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function PerfilPage() {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    campaign: "",
    recoveryEmail: ""
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        campaign: user.campaign || "",
        recoveryEmail: user.recoveryEmail || ""
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    updateProfile({
      name: formData.name,
      role: formData.role,
      campaign: formData.campaign,
      recoveryEmail: formData.recoveryEmail
    });
    
    setIsSaving(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Pwd Change state
  const { changePassword } = useAuth();
  const [pwdData, setPwdData] = useState({ current: "", new: "", confirm: "" });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [pwdStatus, setPwdStatus] = useState({ type: "", message: "" });
  const [isChangingPwd, setIsChangingPwd] = useState(false);

  const handlePwdChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdStatus({ type: "", message: "" });
    
    if (pwdData.new !== pwdData.confirm) {
      setPwdStatus({ type: "error", message: "As novas senhas não coincidem." });
      return;
    }
    if (pwdData.new.length < 6) {
      setPwdStatus({ type: "error", message: "A nova senha deve ter pelo menos 6 caracteres." });
      return;
    }

    setIsChangingPwd(true);
    try {
      await changePassword(pwdData.current, pwdData.new);
      setPwdStatus({ type: "success", message: "Senha alterada com sucesso!" });
      setPwdData({ current: "", new: "", confirm: "" });
    } catch (err: any) {
      setPwdStatus({ type: "error", message: err.message || "Erro ao alterar a senha." });
    } finally {
      setIsChangingPwd(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações de Perfil</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie suas informações cadastrais e preferências da plataforma.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-podemos-blue to-podemos-green flex items-center justify-center text-white text-4xl font-bold shadow-lg flex-shrink-0">
            {formData.name.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="text-center sm:text-left pt-2">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-podemos-blue font-medium mt-1">{user.role}</p>
            <p className="text-sm text-gray-500 mt-2 max-w-md">
              Mantenha seus dados atualizados. Eles serão exibidos no topo da plataforma e utilizados nos relatórios exportados.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
              <User size={20} className="text-gray-400" />
              Informações Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-podemos-blue/50 focus:border-podemos-blue transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço de E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
                    title="O e-mail de acesso não pode ser alterado por aqui."
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">O e-mail de acesso é fixo para esta conta.</p>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="recoveryEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail de Recuperação Secundário
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="recoveryEmail"
                    name="recoveryEmail"
                    value={formData.recoveryEmail}
                    onChange={handleChange}
                    placeholder="E-mail secundário para redefinição de senha"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-podemos-blue/50 focus:border-podemos-blue transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
              <Briefcase size={20} className="text-gray-400" />
              Informações da Campanha
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo Almejado / Função
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Flag size={16} className="text-gray-400" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={(e: any) => handleChange(e)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-podemos-blue/50 focus:border-podemos-blue transition-colors appearance-none"
                    required
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
                <label htmlFor="campaign" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Projeto / Campanha
                </label>
                <input
                  type="text"
                  id="campaign"
                  name="campaign"
                  value={formData.campaign}
                  onChange={handleChange}
                  placeholder="Ex: Eleições SC 2026"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-podemos-blue/50 focus:border-podemos-blue transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            {showSuccess && (
              <span className="flex items-center gap-2 text-sm font-medium text-podemos-green animate-in fade-in mr-4">
                <CheckCircle size={18} />
                Perfil atualizado com sucesso!
              </span>
            )}
            
            <button
              type="button"
              className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 text-sm font-bold text-white bg-podemos-blue rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-podemos-blue/30 transition-all flex items-center gap-2 flex-row-reverse"
            >
              {isSaving ? (
                "Salvando..."
              ) : (
                <>
                  Salvar Alterações
                  <Save size={18} />
                </>
              )}
            </button>
          </div>
        </form>
        
        {/* Security Section */}
        <div className="p-6 sm:p-8 border-t border-gray-100 mt-6 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2 mb-6">
            <Shield size={20} className="text-gray-500" />
            Segurança & Acesso
          </h3>
          
          <form onSubmit={handlePwdChange} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="mb-6">
              <h4 className="font-bold text-gray-900">Alterar Senha</h4>
              <p className="text-sm text-gray-500 mt-1">Sua nova senha deve ser diferente das anteriores e ter no mínimo 6 caracteres.</p>
            </div>

            {pwdStatus.message && (
              <div className={`mb-6 p-3 rounded-lg flex items-start gap-2 text-sm ${pwdStatus.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                {pwdStatus.type === 'error' ? <AlertCircle size={18} className="mt-0.5" /> : <CheckCircle size={18} className="mt-0.5" />}
                <span>{pwdStatus.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type={showPwd.current ? "text" : "password"}
                    value={pwdData.current}
                    onChange={(e) => setPwdData({...pwdData, current: e.target.value})}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-podemos-blue/50 focus:border-podemos-blue transition-colors"
                  />
                  <button type="button" onClick={() => setShowPwd({...showPwd, current: !showPwd.current})} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    {showPwd.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type={showPwd.new ? "text" : "password"}
                    value={pwdData.new}
                    onChange={(e) => setPwdData({...pwdData, new: e.target.value})}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-podemos-blue/50 focus:border-podemos-blue transition-colors"
                  />
                  <button type="button" onClick={() => setShowPwd({...showPwd, new: !showPwd.new})} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    {showPwd.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type={showPwd.confirm ? "text" : "password"}
                    value={pwdData.confirm}
                    onChange={(e) => setPwdData({...pwdData, confirm: e.target.value})}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-podemos-blue/50 focus:border-podemos-blue transition-colors"
                  />
                  <button type="button" onClick={() => setShowPwd({...showPwd, confirm: !showPwd.confirm})} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    {showPwd.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isChangingPwd}
                className="px-6 py-2 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 transition-colors"
              >
                {isChangingPwd ? "Atualizando..." : "Atualizar Senha"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
