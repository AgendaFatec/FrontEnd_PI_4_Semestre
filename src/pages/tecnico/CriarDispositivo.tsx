import React, { useState } from 'react';
import { api } from '../../services/api';
import type { DispositvoTipo, StatusDispositivo } from '../../interfaces/deviceInterface';

interface ModalCriarProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function ModalCriarDispositivo({ onClose, onSuccess }: ModalCriarProps) {
  const [salvando, setSalvando] = useState(false);
  const [formData, setFormData] = useState({
    nomeDispositivo: '',
    tipoDispositivo: 'NOTEBOOK' as DispositvoTipo,
    patrimonio: '',
    statusDispositivo: 'ATIVO' as StatusDispositivo
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      // De acordo com seu DispositivoRouter, o POST é na raiz /dispositivos
      await api.post('dispositivos', formData);
      onSuccess(); // Fecha o modal e atualiza a lista
    } catch (error: any) {
      alert("Erro ao criar dispositivo: " + (error.response?.data?.message || "Erro no servidor"));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#004A61]">Novo Dispositivo</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ... Mesmos campos de INPUT do Modal de Editar ... */}
            <div>
              <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">Nome</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#B20000]"
                value={formData.nomeDispositivo}
                onChange={e => setFormData({ ...formData, nomeDispositivo: e.target.value })}
              />
            </div>
            
            {/* Grid para Tipo e Patrimônio */}
            <div className="grid grid-cols-2 gap-4">
               {/* Select de Tipo e Input de Patrimônio iguais ao anterior */}
               <div>
                <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">Tipo</label>
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#B20000]"
                  value={formData.tipoDispositivo}
                  onChange={e => setFormData({ ...formData, tipoDispositivo: e.target.value as DispositvoTipo })}
                >
                  <option value="NOTEBOOK">Notebook</option>
                  <option value="DESKTOP">Desktop</option>
                  <option value="TV">TV</option>
                  <option value="PROJETOR">Projetor</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">Patrimônio</label>
                <input
                  type="text"
                  placeholder="Ex: 123456"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#B20000]"
                  value={formData.patrimonio}
                  onChange={e => setFormData({ ...formData, patrimonio: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all">
                Cancelar
              </button>
              <button type="submit" disabled={salvando} className="flex-1 py-3 bg-[#004A61] text-white font-bold rounded-xl hover:bg-[#003546] shadow-lg">
                {salvando ? 'Criando...' : 'Cadastrar Dispositivo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}