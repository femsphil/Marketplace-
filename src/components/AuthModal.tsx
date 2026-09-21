import React, { useState } from 'react';
import { X, User, Building, Shield, Check, Phone, Mail, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { UserAccount, UserRole } from '../types';
import { DEFAULT_USERS } from '../data/platformData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onSwitchUser: (user: UserAccount) => void;
  onRegisterUser: (newUser: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchUser,
  onRegisterUser,
}) => {
  const [activeTab, setActiveTab] = useState<'switch' | 'register'>('switch');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'registered' | 'professional'>('registered');
  const [regCompany, setRegCompany] = useState('');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim() || '+234 800 000 0000',
      role: regRole,
      businessName: regCompany.trim() || undefined,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      phoneVerified: true,
      emailVerified: true,
      ninVerified: false,
      cacVerified: regRole === 'professional',
      plan: regRole === 'professional' ? 'Professional' : 'Free',
      activeListingsCount: 0,
      maxListings: regRole === 'professional' ? 50 : 5,
      status: 'active',
    };

    onRegisterUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-display text-white">
                Account & Persona Switcher
              </h3>
              <p className="text-[11px] text-slate-400">
                Experience StrucTrade as Buyer, Seller, or Platform Admin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('switch')}
            className={`flex-1 py-3 text-xs font-bold text-center transition cursor-pointer ${
              activeTab === 'switch'
                ? 'border-b-2 border-emerald-600 text-emerald-800 bg-white'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Quick Persona Switch
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-xs font-bold text-center transition cursor-pointer ${
              activeTab === 'register'
                ? 'border-b-2 border-emerald-600 text-emerald-800 bg-white'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Tab 1: Persona Switcher */}
        {activeTab === 'switch' && (
          <div className="p-5 sm:p-6 space-y-3">
            <p className="text-xs text-slate-500">
              Select any role below to test the end-to-end functionality outlined in PRD Sections 5–8:
            </p>

            <div className="space-y-2.5">
              {DEFAULT_USERS.map((user) => {
                const isCurrent = user.id === currentUser.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSwitchUser(user);
                      onClose();
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{user.name}</span>
                          {user.role === 'admin' && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                              SUPER ADMIN
                            </span>
                          )}
                          {user.role === 'professional' && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                              CORPORATE SELLER
                            </span>
                          )}
                          {user.role === 'registered' && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              BUYER / CONTRACTOR
                            </span>
                          )}
                          {user.role === 'guest' && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                              GUEST
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {user.role === 'admin' && 'Access Admin Portal, approve listings, review reports, and verify sellers'}
                          {user.role === 'professional' && 'Manage 200 inventory items, lead CRM pipeline, rental requisitions, store'}
                          {user.role === 'registered' && 'Browse, save favorites, send trade chats, request viewings & rentals'}
                          {user.role === 'guest' && 'Public marketplace browsing with login requirements for contacting'}
                        </p>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="p-5 sm:p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRole('registered')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer text-xs font-bold ${
                    regRole === 'registered'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Individual / Buyer
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('professional')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer text-xs font-bold ${
                    regRole === 'professional'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Professional Seller / Agency
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Full Name *</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Chief Babatunde Adeleke"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {regRole === 'professional' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Company / Agency Name (CAC Registered)</label>
                <input
                  type="text"
                  value={regCompany}
                  onChange={(e) => setRegCompany(e.target.value)}
                  placeholder="e.g. Landmark Infrastructure & Heavy Lift Ltd"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@domain.ng"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Nigerian Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+234 803 000 0000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-900/20"
              >
                <span>Register & Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
