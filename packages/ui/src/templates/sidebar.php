<div class="d-flex flex-column flex-shrink-0 bg-body-tertiary">
  <ul class="nav nav-pills nav-flush flex-column mb-auto text-center">
    <a href="#" class="d-block my-1 p-1 link-body-emphasis text-decoration-none" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Bigpoint Discord Management">
      <img class="bi pe-none rounded-circle" style="width:48px;height:48px;" role="img" aria-label="Bigpoint Logo" src="assets/bigpoint.png" />
    </a>
    <hr class="border border-2 opacity-50">
    <?php foreach($my_guilds as $guild){?>
      <li class="nav-item">
      <a href="#" data-server-id="<?php echo $guild['guild_id']; ?>" class="nav-link py-2 rounded-circle" aria-current="page" data-bs-toggle="tooltip" data-bs-title="<?php echo $guild['guild_name']; ?>" data-bs-placement="right" aria-label="<?php echo $guild['guild_name']; ?>">
        <img class="bi pe-none rounded-circle" style="width:48px;height:48px;" role="img" aria-label="<?php echo $guild['guild_name']; ?>" src="<?php echo $guild['guild_icon'] ?? "https://ui-avatars.com/api/?name={$guild['guild_name']}"; ?>" />
      </a>
    </li>
    <?php } ?>
  </ul>
  <div class="dropdown border-top">
    <a href="#" class="d-flex align-items-center justify-content-center p-3 link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
      <img src="https://cdn.discordapp.com/avatars/<?php echo $me['id']; ?>/<?php echo $me['avatar']; ?>.webp?size=64" alt="avatar" width="24" height="24" class="rounded-circle">
    </a>
    <ul class="dropdown-menu text-small shadow">
      <li><a class="dropdown-item" href="#"><?php echo $me['username']; ?></a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="logout.php">Sign out</a></li>
    </ul>
  </div>
</div>