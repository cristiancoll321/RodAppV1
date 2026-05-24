package com.rodapp.backend.service;

import com.rodapp.backend.model.Motocicleta;
import com.rodapp.backend.model.Usuario;
import com.rodapp.backend.repository.UsuarioRepository;
import com.rodapp.backend.repository.MotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MotoService {
    @Autowired
    private MotoRepository motoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;





    /**
     * Obtiene la lista completa de motocicletas registradas en el sistema.
     * Viaje del dato: Llama al repositorio (JPA) que ejecuta un "SELECT * FROM motocicleta".
     * @return List de objetos Motocicleta.
     */
    public List<Motocicleta> getMotocicletas(){
        return this.motoRepository.findAll();
    }

    /**
     * Guarda una nueva motocicleta en la base de datos.
     * Viaje del dato: Recibe el objeto desde el controlador, el repositorio genera el INSERT SQL
     * y retorna el objeto guardado incluyendo el ID generado por la DB.
     * @param moto Objeto con los datos a persistir.
     * @return La motocicleta guardada con su ID.
     */
    public Motocicleta registrar(Motocicleta moto){
        //Validar que venga usuario
        if (moto.getUsuario() == null || moto.getUsuario().getId() == null) {
            throw new RuntimeException("La moto debe tener un usuario");
        }

        //Buscar usuario real en BD
        Usuario usuario = usuarioRepository.findById(moto.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Asignar usuario gestionado por JPA
        moto.setUsuario(usuario);

        return motoRepository.save(moto);
    }



    /**
     * Busca una motocicleta específica por su identificador único.
     * Viaje del dato: El repositorio busca por ID; si existe lo devuelve, si no,
     * lanza una excepción que detiene el flujo y puede ser capturada para informar al usuario.
     * @param id ID de la moto a buscar.
     * @return El objeto Motocicleta encontrado.
     * @throws RuntimeException Si el ID no existe en la base de datos.
     */
    public Motocicleta getMotoPorId(Long id) {
        return motoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Motocicleta no encontrada con id: " + id));
    }

    /**
     * Actualiza los datos de una motocicleta existente.
     * Viaje del dato: 
     * 1. Busca la moto actual por ID para asegurarse de que existe.
     * 2. Sobrescribe los valores del objeto "viejo" con los del "nuevo" (motoDetalles).
     * 3. Guarda los cambios. JPA detecta que el ID ya existe y realiza un UPDATE en lugar de un INSERT.
     * @param id ID de la moto a modificar.
     * @param motoDetalles Objeto que contiene los nuevos valores enviados desde el frontend.
     * @return El objeto Motocicleta ya actualizado.
     */
    public Motocicleta actualizar(Long id, Motocicleta motoDetalles) {
        Motocicleta moto = getMotoPorId(id); 

        moto.setMarca(motoDetalles.getMarca());
        moto.setModelo(motoDetalles.getModelo());
        moto.setPlaca(motoDetalles.getPlaca());
        moto.setCilindrada(motoDetalles.getCilindrada());
        moto.setTipoCombustible(motoDetalles.getTipoCombustible());
        moto.setColor(motoDetalles.getColor());
        moto.setKmActual(motoDetalles.getKmActual());

        return motoRepository.save(moto);
    }

    public List<Motocicleta> getMotosPorUsuario(Long usuarioId) {
        return motoRepository.findByUsuarioId(usuarioId);
    }

    /**
     * Elimina permanentemente una motocicleta de la base de datos.
     * Viaje del dato: Primero verifica existencia y luego el repositorio ejecuta el DELETE SQL.
     * @param id ID de la moto a borrar.
     */
    public void eliminar(Long id) {
        Motocicleta moto = getMotoPorId(id);
        motoRepository.delete(moto);
    }


}
