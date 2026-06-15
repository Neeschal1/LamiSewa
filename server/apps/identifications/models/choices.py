DOCUMENT_TYPES = [
    ('Citizenship', 'CITIZENSHIP'),
    ('Passport', 'PASSPORT'),
    ('National ID', 'NATIONAL ID'),
    ('Driving License', 'DRIVING LICENSE'),
    ('Birth Certificate', 'BIRTH CERTIFICATE'),
    ('Voter ID', 'VOTER ID'),
    ('Residence Permit', 'RESIDENCE PERMIT'),
    ('Other', 'OTHER'),
]


PACKAGE_TYPES = [
    ("Basic", "BASIC"),
    ("Premium", "PREMIUM"),
    ("VIP", "VIP"),
]

PAYMENT_METHODS = [
    ("eSewa", "ESEWA"),
    ("Khalti", "KHALTI"),
    ("ConnectIPS", "CONNECT_IPS"),
    ("Visa", "VISACARD"),
    ("Mastercard", "MASTERCARD"),
    ("American Express", "AMERICAN_EXPRESS"),
]

STATUS_CHOICES = [
    ('Pending', 'PENDING'),
    ('Verified', 'VERIFIED'),
    ('Cancelled', 'CANCELLED'),
    ('Rejected', 'REJECTED'),
    ('Under Review', 'UNDER REVIEW'),
    ('Completed', 'COMPLETED'),
    ('Failed', 'FAILED'),
]