package com.rodapp.backend.repository;

import com.rodapp.backend.model.Tanqueada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TanqueadaRepository extends JpaRepository<Tanqueada, Long> {
    /**
      * Busca todas las tanqueadas asociadas a una
     motocicleta específica.
      * @param motoId ID de la motocicleta.
      * @return Lista de tanqueadas ordenadas por fecha.
      */
    List<Tanqueada> findByMotocicletaId(Long motoId);

    /**
     * Busca todas las tanqueadas de todas las motos de un usuario.
     * @param usuarioId ID del usuario.
     * @return Lista de tanqueadas.
     */
    List<Tanqueada> findByMotocicletaUsuarioId(Long usuarioId);
}
