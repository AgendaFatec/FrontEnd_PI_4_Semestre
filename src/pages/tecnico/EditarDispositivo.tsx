import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type {Dispositivo, DispositvoTipo, StatusDispositivo} from '../../interfaces/deviceInterface';

interface ModalProps {
  dispositivoId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModalEditarDispositivo({ dispositivoId, onClose, onSuccess }: ModalProps) {
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [formData, setFormData] = useState({
    nomeDispositivo: '',
    tipoDispositivo: 'NOTEBOOK' as DispositvoTipo,
    patrimonio: '',
    statusDispositivo: 'ATIVO' as StatusDispositivo
  });

  useEffect(() => {
  const carregar = async () => {
    try {
      setLoading(true);
      // Tipamos a resposta esperada do service
      const response = await api.get<any>(`dispositivos/get-device/${dispositivoId}`);
      const d: Dispositivo = response.data;
      if (d) {
        setFormData({
          nomeDispositivo: d.nomeDispositivo || '',
          tipoDispositivo: d.tipoDispositivo || 'NOTEBOOK',
          patrimonio: d.patrimonio || '',
          statusDispositivo: d.statusDispositivo || 'ATIVO'
        });
      }
    } catch (error) {
      console.error("Erro detalhado ao carregar dispositivo:", error);
      alert("Não foi possível carregar os dados do dispositivo.");
      onClose();
    } finally {
      setLoading(false);
    }
  };
  carregar();
}, [dispositivoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await api.put(`dispositivos/update-device/${dispositivoId}`, formData);
      onSuccess();
    } catch (error) {
      alert("Erro ao atualizar");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#004A61]">Editar Detalhes</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
          </div>

          {loading ? (
            <div className="py-10 text-center text-[#004A61]">Carregando dados...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">Nome</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#B20000] outline-none"
                  value={formData.nomeDispositivo}
                  onChange={e => setFormData({ ...formData, nomeDispositivo: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">Tipo</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none"
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
                    maxLength={7}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none"
                    value={formData.patrimonio}
                    onChange={e => setFormData({ ...formData, patrimonio: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">Status</label>
                <div className="flex gap-2">
                  {(['ATIVO', 'INATIVO', 'DANIFICADO'] as StatusDispositivo[]).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({ ...formData, statusDispositivo: s })}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${
                        formData.statusDispositivo === s ? 'bg-[#B20000] text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando} className="flex-1 py-3 bg-[#004A61] text-white font-bold rounded-xl hover:bg-[#003546] transition-all shadow-lg">
                  {salvando ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}