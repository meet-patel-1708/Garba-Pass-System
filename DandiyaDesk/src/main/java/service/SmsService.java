package service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
@Service
@Slf4j
public class SmsService {
    private static final String ACCOUNT_SID = "";
    private static final String AUTH_TOKEN = "";
    private static final String FROM_NUMBER = "+";

    static {
        Twilio.init(ACCOUNT_SID,AUTH_TOKEN);
    }
    public void sendSms(String to,String msg){
        try{
            Message.creator(new com.twilio.type.PhoneNumber(to),
                    new com.twilio.type.PhoneNumber(FROM_NUMBER),
                    msg).create();
            log.info("SMS Sent Successfully to {}",to);
        }catch(Exception e){
            log.info("SMS not Sent Successfully to {}:{}",to,e.getMessage());
        }
    }
}
