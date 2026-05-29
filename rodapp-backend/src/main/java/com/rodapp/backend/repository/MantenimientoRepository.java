package com.rodapp.backend.repository;


import com.rodapp.backend.model.Mantenimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MantenimientoRepository extends JpaRepository<Mantenimiento, Long> {
    /**
      * Busca todos los mantenimientos asociados a una motocicleta específica.
      * @param motoId ID de la motocicleta.
      * @return Lista de mantenimientos.
      */
    List<Mantenimiento> findByMotocicletaId(Long motoId);

    /**
     * Busca todos los mantenimientos de todas las motos de un usuario.
     * @param usuarioId ID del usuario.
     * @return Lista de mantenimientos.
     */
    List<Mantenimiento> findByMotocicletaUsuarioId(Long usuarioId);
}
