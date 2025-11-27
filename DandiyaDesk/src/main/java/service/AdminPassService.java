package service;

import lombok.RequiredArgsConstructor;
import model.Pass;
import org.springframework.stereotype.Service;
import repository.PassRepo;

@Service @RequiredArgsConstructor
public class AdminPassService {
    private final PassRepo passRepo;

    public String blockPass(String serialNumber){
        Pass pass = passRepo.findBySerialNumber(serialNumber)
                .orElseThrow(()->new RuntimeException("Pass not found"));
        if(!pass.isActive()){
            return "Pass is already bloacked";
        }
        pass.setActive(false);
        passRepo.save(pass);

        return "Pass "+pass.getSerialNumber()+" has been blocked successfully";
    }
    public String unblockPass(String serialNumber){
        Pass pass = passRepo.findBySerialNumber(serialNumber)
                .orElseThrow(()->new RuntimeException("Pass not found"));
        if(pass.isActive()){
            return "Pass is already unbloacked";
        }
        pass.setActive(true);
        passRepo.save(pass);

        return "Pass "+pass.getSerialNumber()+" has been unblocked successfully";
    }

    public String getPassStatus(String serialNumber){
        Pass pass = passRepo.findBySerialNumber(serialNumber)
                .orElseThrow(()->new RuntimeException("Pass not found"));
        String status = pass.isActive() ? "ACTIVE":"BLOCKED";
        return "Pass "+serialNumber+" | Status:"+status;
    }


}
