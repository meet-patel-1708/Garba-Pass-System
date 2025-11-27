package controller;

import lombok.RequiredArgsConstructor;
import model.Pass;
import model.PassOrder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.PassSellService;

@RestController
@RequestMapping("/api/sell")
@RequiredArgsConstructor
public class PassSellController {
    private final PassSellService sellService;
    @PostMapping("/create")
    public ResponseEntity<PassOrder> createOrder(
            @RequestParam Long buyerId,
            @RequestParam Long organizerId,
            @RequestParam double amount
    ){
        PassOrder order = sellService.createNewOrder(buyerId,organizerId,amount);
        return ResponseEntity.ok(order);
    }
    @PostMapping("/complete/{orderId}")
    public ResponseEntity<Pass> completeOrder(
            @PathVariable Long orderId,
            @RequestParam String paymentRef
    ) {
        Pass pass = sellService.completePassSell(orderId,paymentRef);
        return ResponseEntity.ok(pass);
    }
}
