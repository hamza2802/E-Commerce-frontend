import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DeliveryAgentService } from 'src/app/services/delivery-agent/deliveryAgentService';


declare var bootstrap: any;

@Component({
  selector: 'app-agentProfile',
  templateUrl: './agentProfile.component.html',
  styleUrls: ['./agentProfile.component.css']
})
export class AgentProfile implements OnInit {
  profileForm!: FormGroup;
  profilePicture: File | null = null; // Store the selected profile picture
  profilePictureUrl: string | null = null; // URL for displaying image preview
  isEditing: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private deliveryAgentService: DeliveryAgentService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer // Inject DomSanitizer
  ) {}
  

  ngOnInit(): void {
    // this.loadUserProfile();
    this.profileForm = this.fb.group({
      email: [{ value: null, disabled: true }, [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      vehicleType: ['', [Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      vehicleNumber: ['', Validators.required],
      deliveryZone: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
     
    });
  
    // Fetch initial data
    this.deliveryAgentService.getDeliveryAgent().subscribe((data) => {
      this.profileForm.patchValue(data);
    });
  
    // Fetch the profile picture URL
    this.fetchProfilePicture();
  }
  
  // Fetch Profile Picture
  private fetchProfilePicture(): void {
    this.http.get<{ imageUrl: string }>('http://localhost:8080/e-commerce/users/picture')
      .subscribe(
        (response) => {
          this.profilePictureUrl = this.sanitizer.bypassSecurityTrustUrl(response.imageUrl) as string;
        },
        (error) => {
          console.error('Failed to fetch profile picture:', error);
        }
      );
  }
  
  

  // Add this method in your ProfileComponent class
onFileSelect(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.profilePicture = file;

    // Create a preview URL for the selected file (optional)
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profilePictureUrl = e.target.result; // Display the image preview
    };
    reader.readAsDataURL(file);
  }
}


  // // Update Profile Picture
  updateProfilePicture(): void {
    if (this.profilePicture) {
      this.uploadProfilePicture(this.profilePicture).subscribe(
        () => {
          this.successMessage = 'Profile picture updated successfully.';
          this.isEditing = false;
          this.deliveryAgentService.setLoggedInUser({ ...this.profileForm.value, profilePicture: this.profilePictureUrl });
          // Show success modal
          const modal = new bootstrap.Modal(document.getElementById('successModal'));
          modal.show();
        },
        (error) => {
          this.errorMessage = 'Failed to update profile picture.';
        }
      );
    }
  }

  // Save Profile Information
  // saveProfile(): void {
  //   if (this.profileForm.valid) {
  //     const updatedProfile = this.profileForm.value;
  //     this.saveCustomerDetails(updatedProfile);
  //   }
  // }

  // Save Customer Details
  // saveCustomerDetails(updatedProfile: any): void {
  //   this.customerService.saveCustomerDetails(updatedProfile).subscribe(
  //     (response) => {
  //       this.successMessage = 'Profile updated successfully.';
  //       this.isEditing = false;
  //       this.customerService.setLoggedInUser(updatedProfile);
  //       // Show success modal
  //       const modal = new bootstrap.Modal(document.getElementById('successModal'));
  //       modal.show();
  //     },
  //     (error) => {
  //       this.errorMessage = 'Failed to update profile. Please try again.';
  //     }
  //   );
  // }

  // Handle File Change (Preview Profile Picture)
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profilePicture = file;

      // Create an object URL for the selected image and set it for preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePictureUrl = e.target.result; // Set the URL for image preview
      };
      reader.readAsDataURL(file);
    }
  }

  

  // Upload Profile Picture
  uploadProfilePicture(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('access_token') // Include token if necessary
    });

    return this.http.post('http://localhost:8080/e-commerce/users/upload-profile-picture', formData, {
      headers: headers
    });
  }

  // Cancel Editing and Reload Profile
  // cancelEditing(): void {
  //   this.isEditing = false;
  //   this.loadUserProfile();
  // }

  // Load User Profile
  // loadUserProfile(): void {
  //   this.customerService.getLoggedInUser().subscribe(
  //     (user) => {
  //       console.log(user);
        
  //       if (user) {
  //         this.profileForm.patchValue(user);
  //       }
  //     },
  //     (error) => {
  //       this.errorMessage = 'Failed to load user profile.';
  //     }
  //   );
  // }

  // Close Modal and Redirect
  closeModalAndRedirect(): void {
    const modal = bootstrap.Modal.getInstance(document.getElementById('successModal'));
    modal.hide();
    this.router.navigate(['customer-dashboard/customer-home']);
  }
}
