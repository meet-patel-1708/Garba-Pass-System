package scheduler;

import lombok.RequiredArgsConstructor;
import model.Pass;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import repository.PassRepo;
import service.SmsService;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PassExpiryScheduler {
    private final PassRepo passRepo;
    private final SmsService smsService;

    @Scheduled(cron = "0 0 0 * * ?")
    public void autoBlockExpieredPass(){
        List<Pass> passes = passRepo.findAll();
        for(Pass pass:passes){
            if(pass.isActive() && pass.getExpiryDate()!=null && pass.getExpiryDate().isBefore(LocalDate.now())){
                pass.setActive(false);
                passRepo.save(pass);

                smsService.sendSms(pass.getOwner().getPhone(),"Dear"+pass.getOwner().getFullName()+", your garba pass("+pass.getSerialNumber()+") has expierd today");
                System.out.println("Auto-blocked expired pass:"+pass.getSerialNumber());
            }
        }
    }
}
