package com.rodapp.backend.service;

import com.rodapp.backend.model.Motocicleta;
import com.rodapp.backend.repository.MotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MotoService {
    @Autowired
    private MotoRepository motoRepository;


    public List<Motocicleta> getMotocicletas(){
        return this.motoRepository.findAll();
    }
    public Motocicleta registrar(Motocicleta moto){
        return motoRepository.save(moto);
    }
}
