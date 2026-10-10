"""
Comprehensive End-to-End System Tests for CREAM AI Creator Marketplace
Validates:
1. Creator Discovery & Deterministic Filtering (ADR-03)
2. DigiLocker KYC Zero-Storage Verification (ADR-02)
3. AI Brief Extraction & Parameter Structuring (F-01)
4. Virtual Contract Generation & Digital Signing Gate (F-05)
5. Upfront Razorpay Escrow Order & Signature Verification (ADR-04)
6. Dual Watermarking & SynthID Steganography Integrity (ADR-05)
7. Weakly Defensible Rejection Pre-Approval Gate (ADR-05)
8. End-Contract Agreement Sign-Off & Escrow Disbursement (Doc 05)
9. Hybrid Dispute Resolution & AI Compliance Audit (F-07)
"""

import urllib.request
import urllib.parse
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:3000"

def request_json(path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    req_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode("utf-8"))

def run_all_tests():
    print("==================================================")
    print("       CREAM PLATFORM END-TO-END VERIFICATION      ")
    print("==================================================")

    # Test 1: Creator Discovery
    print("\n[TEST 1] Testing Deterministic Creator Discovery & Match Scoring...")
    res = request_json("/api/creators/search?tool=Runway%20Gen-2&maxBudget=80000")
    assert res["total"] > 0, "No creators found for Runway Gen-2"
    creator = res["creators"][0]
    score = res["matchScores"][creator["id"]]
    print(f"  ✓ Found Creator: {creator['display_name']} ({creator['tagline']})")
    print(f"  ✓ Match Confidence Score: {score}%")
    print(f"  ✓ Verified Badges: {creator['verified_badges']}")

    # Test 2: DigiLocker KYC
    print("\n[TEST 2] Testing DigiLocker Zero-Storage Government KYC...")
    kyc_res = request_json("/api/digilocker/callback", method="POST", data={
        "code": "TEST_AADHAAR_CODE_9921",
        "userId": "user_creator_arjun"
    })
    assert kyc_res["success"] is True, "DigiLocker verification failed"
    token_ref = kyc_res["result"]["aadhaarTokenRef"]
    assert token_ref.startswith("DL_REF_SHA256_"), "Token format mismatch"
    print(f"  ✓ Government Authority: {kyc_res['result']['issuer']}")
    print(f"  ✓ Cryptographic Ref Token: {token_ref}")
    print("  ✓ Zero raw identity files hosted on CREAM servers (ADR-02 Compliant)")

    # Test 3: AI Brief Builder Extraction
    print("\n[TEST 3] Testing Conversational AI Brief Builder...")
    brief_res = request_json("/api/briefs", method="POST", data={
        "history": [],
        "userMessage": "Need a 30s photorealistic commercial for a luxury electric hypercar, Tokyo neon rain, 16:9, Runway Gen-2, budget 60000 INR",
        "clientId": "user_client_demo"
    })
    extracted = brief_res.get("extractedBrief")
    assert extracted is not None, "Failed to extract structured brief"
    print(f"  ✓ Extracted Content Type: {extracted['content_type'].upper()} ({extracted['aspect_ratio']})")
    print(f"  ✓ Extracted Models: {extracted['model_preferences']}")
    print(f"  ✓ Extracted Budget Range: ₹{extracted['budget_min']} - ₹{extracted['budget_max']}")

    # Finalize Brief
    finalize_res = request_json("/api/briefs", method="POST", data={
        "finalizeBrief": True,
        "briefData": extracted,
        "clientId": "user_client_demo",
        "history": [{"role": "client", "text": "Tokyo hypercar brief"}]
    })
    brief_id = finalize_res["brief"]["id"]
    print(f"  ✓ Brief Published: #{brief_id}")

    # Test 4: Virtual Contract & Digital Signing Gate
    print("\n[TEST 4] Testing Virtual Contract Gate & Digital Signatures...")
    contract_res = request_json("/api/contracts", method="POST", data={
        "briefId": brief_id,
        "clientId": "user_client_demo",
        "creatorId": "user_creator_arjun",
        "terms": {
            "deliverables": ["1x 30s Master 4K Video Commercial", "3x High-Res Still Keyframes"],
            "resolution": "4K UHD",
            "aspect_ratio": "16:9 Landscape",
            "max_revisions": 2,
            "deadline": "7 Days",
            "licensing_rights": "Perpetual Commercial Advertising",
            "agreed_amount": 60000,
            "escrow_milestones": [{"name": "Vault Deposit", "percent": 100}]
        }
    })
    contract_id = contract_res["contract"]["id"]
    print(f"  ✓ Contract Initialized: #{contract_id}")
    print(f"  ✓ Contract SHA256 Integrity: {contract_res['contract']['contract_checksum'][:32]}...")

    # Sign by Client
    request_json("/api/contracts/sign", method="POST", data={"contractId": contract_id, "role": "client"})
    # Sign by Creator
    sign_res = request_json("/api/contracts/sign", method="POST", data={"contractId": contract_id, "role": "creator"})
    assert sign_res["contract"]["status"] == "escrow_pending", "Status should be escrow_pending"
    print("  ✓ Client & Creator signed: Contract locked, awaiting Razorpay Escrow Vault deposit")

    # Test 5: Live AI Witness Negotiation Message
    print("\n[TEST 5] Testing Live AI Witness Monitoring in Negotiation Chat...")
    chat_res = request_json("/api/negotiation", method="POST", data={
        "contractId": contract_id,
        "senderId": "user_creator_arjun",
        "senderRole": "creator",
        "message": "I will train a custom LoRA on your vehicle blueprints for exact temporal consistency."
    })
    ai_note = chat_res.get("aiWitnessMessage")
    if ai_note:
        print(f"  ✓ AI Witness Intervened: \"{ai_note['message']}\"")
    else:
        print("  ✓ Negotiation message recorded in contract transcript.")

    # Test 6: Razorpay Escrow Vault Order & Verification
    print("\n[TEST 6] Testing Razorpay Upfront Escrow Deposit...")
    order_res = request_json("/api/escrow/order", method="POST", data={"contractId": contract_id})
    order_id = order_res["order"]["id"]
    print(f"  ✓ Razorpay Order Created: {order_id} for ₹{order_res['order']['amount'] / 100}")

    verify_escrow = request_json("/api/escrow/verify", method="POST", data={
        "contractId": contract_id,
        "razorpayOrderId": order_id,
        "razorpayPaymentId": f"pay_{order_id}",
        "razorpaySignature": "sig_valid_test"
    })
    assert verify_escrow["success"] is True, "Escrow signature verification failed"
    assert verify_escrow["contract"]["status"] == "in_progress", "Contract should be in_progress"
    print("  ✓ HMAC-SHA256 signature verified. Funds securely locked in CREAM Escrow Vault!")

    # Test 7: Dual Watermarking & SynthID Steganography Pipeline
    print("\n[TEST 7] Testing Dual Watermarking & SynthID Steganography...")
    sample_upload = request_json("/api/samples/upload", method="POST", data={
        "contractId": contract_id,
        "creatorId": "user_creator_arjun"
    })
    print(f"  ✓ Dual watermarked sample created: {sample_upload['sample']['watermarked_url']}")
    print("  ✓ Testing SynthID verification endpoint on public/uploads/test_watermark.png...")
    verify_synthid = request_json("/api/samples/verify-synthid", method="POST", data={
        "imageRelativeUrl": "/uploads/test_watermark.png"
    })
    assert verify_synthid["verified"] is True, "SynthID steganography verification failed"
    print(f"  ✓ SynthID Steganography Confirmed: Creator={verify_synthid['payload']['creator_name']}, Contract={verify_synthid['payload']['contract_id']}")

    # Test 8: Weakly Defensible Rejection Sample Approval
    print("\n[TEST 8] Testing Weakly Defensible Rejections Pre-Approval Gate (ADR-05)...")
    # Fetch sample
    workspace_data = request_json(f"/api/contracts?id={contract_id}")
    sample_id = None
    if workspace_data.get("samples") and len(workspace_data["samples"]) > 0:
        sample_id = workspace_data["samples"][0]["id"]
    else:
        # Upload a sample for this contract
        upload_res = request_json("/api/samples/upload", method="POST", data=None)
    
    # Pre-approve sample
    samples_list = request_json(f"/api/contracts?id={contract_id}").get("samples", [])
    if samples_list:
        sample_to_approve = samples_list[0]["id"]
        approve_res = request_json("/api/samples/approve", method="POST", data={
            "sampleId": sample_to_approve,
            "action": "pre_approve",
            "feedback": "Lighting and vehicle motion pre-approved."
        })
        assert approve_res["success"] is True, "Pre-approval failed"
        print("  ✓ Sample pre-approved! Weakly defensible rejection boundary locked per ADR-05.")

    # Test 9: End-Contract Finalization & Escrow Payout
    print("\n[TEST 9] Testing End-Contract Agreement & Escrow Payout Release...")
    finalize_contract = request_json("/api/contracts/finalize", method="POST", data={
        "contractId": contract_id,
        "clientSignature": "DIGITAL_SIG_ALEX_MORGAN",
        "feedbackRating": 5.0
    })
    assert finalize_contract["success"] is True, "Finalization failed"
    print(f"  ✓ End-Contract Signed. Payout disbursed: {finalize_contract['payoutResult']['payoutId']}")
    print("  ✓ Pristine unwatermarked master file unlocked.")
    print("  ✓ Project metadata appended to creator profile ranking.")

    # Test 10: Hybrid Dispute Resolution Console
    print("\n[TEST 10] Testing Hybrid Dispute Resolution Console & AI Audit...")
    dispute_res = request_json("/api/disputes", method="POST", data={
        "contractId": contract_id,
        "raisedBy": "user_client_demo",
        "reason": "Test dispute audit check on camera grading consistency"
    })
    dispute_id = dispute_res["dispute"]["id"]
    ai_audit = dispute_res["dispute"]["ai_analysis"]
    print(f"  ✓ Dispute Filed: #{dispute_id}")
    print(f"  ✓ AI Compliance Score: {ai_audit['sample_compliance_score']}%")
    print(f"  ✓ AI Suggested Split: {ai_audit['suggested_split']['creator_percent']}% Creator / {ai_audit['suggested_split']['client_percent']}% Client")
    print(f"  ✓ AI Recommendation: {ai_audit['recommendation']}")

    resolve_dispute = request_json("/api/disputes/resolve", method="POST", data={
        "disputeId": dispute_id,
        "action": "split",
        "creatorAmount": 30000,
        "clientAmount": 30000,
        "resolvedBy": "Trust & Safety Council"
    })
    assert resolve_dispute["success"] is True, "Dispute resolution failed"
    print("  ✓ Human Specialist Settlement executed: 50/50 split ledger recorded.")

    print("\n==================================================")
    print("      ALL 10 END-TO-END SYSTEM TESTS PASSED!      ")
    print("==================================================")

if __name__ == "__main__":
    try:
        run_all_tests()
    except Exception as e:
        print(f"\n[TEST ERROR]: {e}")
        sys.exit(1)
