import { PackageOpen } from 'lucide-react'
import './ListaProjetos.css'
import CardProjeto from './CardProjeto'

export default function ListaProjetos({ projetos, onEditar, onExcluir, onTarefas, tipo }) {
  return (
    <div className="lista-projetos">
      {projetos.length === 0 ? (
        <div className="lista-vazia">
          <PackageOpen size={48} />
          <p>
            {tipo === 'ativos' 
              ? 'Nenhum projeto ativo no momento.' 
              : 'Nenhum projeto finalizado ainda.'
            }
          </p>
        </div>
      ) : (
        projetos.map(projeto => (
          <CardProjeto 
            key={projeto.id} 
            projeto={projeto}
            onEditar={() => onEditar(projeto)}
            onExcluir={() => onExcluir(projeto)}
            onTarefas={() => onTarefas(projeto)}
          />
        ))
      )}
    </div>
  )
}