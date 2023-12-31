import { Link } from 'react-router-dom'
import Button from '../../components/Button/Button'
import { formatDistanceToNow } from 'date-fns'
import {
  HistoryContainer,
  TableContainer,
  TbodyContainer,
  ContainerMain,
  TheadContainer,
  Rotate,
  LoadingSection,
  ContainerTitle,
  BsSearchHeartStyled,
  Status,
  ButtonsContainer,
} from './historyStyle'
import { useState, useContext, useEffect } from 'react'
import { InputForm } from '../../components/Form/formStyles'
import { ContextCyle } from '../../Context/contextProvider'
import ptBR from 'date-fns/locale/pt-BR'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { filterNameProjectSchema } from '../../schema/FormShemaMain'

export const History = () => {
  const [loading, setLoading] = useState(true)
  const { cycles, deleterCycles } = useContext(ContextCyle)
  const { handleSubmit, register, watch } = useForm({
    resolver: zodResolver(filterNameProjectSchema),
    defaultValues: {
      search: '',
    },
  })

  const filteredCycles = cycles.filter((cycle) =>
    cycle.nome.toLowerCase().includes(watch('search').toLowerCase()),
  )
  const filteredCyclesLength = () => {
    return filteredCycles.length === 0
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [cycles])

  const handleDeleteCycles = () => {
    deleterCycles()
    window.location.reload()
  }

  return (
    <HistoryContainer>
      <ContainerTitle>
        <h1>Meu Histórico</h1>
        <form onSubmit={handleSubmit(handleDeleteCycles)}>
          <InputForm
            type="text"
            list="sugestion-task"
            label="Pesquisar"
            variant="search"
            placeholder="Pesquise sua tarefa"
            {...register('search')}
          />
          <button type="submit">
            <BsSearchHeartStyled />
          </button>
        </form>
        <datalist id="sugestion-task">
          {cycles.map((cycle) => (
            <option key={cycle.id} value={cycle.nome} />
          ))}
        </datalist>
      </ContainerTitle>

      {loading ? (
        <LoadingSection>
          <Rotate size={200} />
        </LoadingSection>
      ) : (
        <>
          <ContainerMain>
            {filteredCyclesLength() ? (
              <p>Nenhuma tarefa encontrada</p>
            ) : (
              <TableContainer>
                <TheadContainer>
                  <tr>
                    <th>Tarefas</th>
                    <th>Duração</th>
                    <th>Início</th>
                    <th>Status</th>
                  </tr>
                </TheadContainer>
                <TbodyContainer>
                  {filteredCycles.map((task) => (
                    <tr key={task.id}>
                      <td>{task.nome}</td>
                      <td>{task.minutes} minutos</td>
                      <td>
                        {formatDistanceToNow(new Date(task.startDate), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </td>
                      <td>
                        {task.finishDate && (
                          <Status statuscolor="green">Concluído</Status>
                        )}

                        {task.interruptedDate && (
                          <Status statuscolor="red">Interrompido</Status>
                        )}

                        {!task.finishDate && !task.interruptedDate && (
                          <Status statuscolor="yellow">Em Andamento</Status>
                        )}
                      </td>
                    </tr>
                  ))}
                </TbodyContainer>
              </TableContainer>
            )}
          </ContainerMain>
          {!filteredCyclesLength() && (
            <ButtonsContainer>
              <Link to="/">
                <Button text="Voltar" variant="back" />
              </Link>
              <Button
                text="Apagar Tudo"
                variant="danger"
                type="submit"
                onClick={handleDeleteCycles}
                disabled={cycles.length === 0}
              />
            </ButtonsContainer>
          )}
        </>
      )}
    </HistoryContainer>
  )
}
