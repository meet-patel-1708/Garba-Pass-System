package service;

import lombok.RequiredArgsConstructor;
import model.EntryLog;
import org.springframework.stereotype.Service;
import repository.EntryLogRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminEntryService {
    private final EntryLogRepository entryLogRepository;

    public List<EntryLog> getAllEntryLog(){
        return entryLogRepository.findAll();
    }

    public List<EntryLog> getEntryLogsBySerial(String serialNumber){
        return entryLogRepository.findBySerialNumber(serialNumber);
    }

    public List<EntryLog> getEntryLogsByMobile(String mobileNumber){
        return entryLogRepository.findByMobileNumber(mobileNumber);
    }
}
